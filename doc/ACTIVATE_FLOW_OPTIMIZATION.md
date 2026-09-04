# 激活课程流程优化:已登录用户免短信验证

> 方案日期:2026-09-04
> 状态:已实施并部署到阿里云生产环境;自动化与生产冒烟通过,等待真实手机号手工链路验收
> 影响范围:6 个文件改动 + 2 个新增文件 + 2 个测试文件

## 实施结果(2026-09-04)

- 新增 `api/_auth.js`,并让 `check-course-access.js` 与 `activate-course.js` 共用完整的 JWT、Redis token、设备和用户鉴权链;`JWT_SECRET` 不再使用开发兜底值
- `/api/activate-course` 现在强制登录,只接受 `activationCode`,不再验证短信、不创建用户、不签发或替换 token
- 激活码消费和用户课程更新被放入**同一段 Redis Lua 脚本**,避免并发重复消费,也避免“激活码已使用但课程未到账”的半完成状态
- `/activate` 对未登录用户跳转 `/login?redirect=/activate`;已登录用户页面只保留激活码输入框
- 登录、注册成功和已登录自动跳转均使用经过 `safeRedirect()` 过滤的站内路径,互跳链接会保留 redirect
- 已部署到 `https://mayinfriday.icdiary.com`

验证结果:

- 目标文件 ESLint:通过
- Vitest:4 个测试文件、13 项测试全部通过
- Vite 生产构建:通过
- 全量 ESLint 仍有 88 个既有 error、2 个既有 warning;本次改动文件为零错误
- 真实阿里云 Redis 临时键验证:首次 Lua 激活成功并同时写入用户课程/标记激活码,第二次返回 `USED`;临时键已清理
- 生产端到端临时账号验证:首次激活 200、课程到账、响应不含 token,重复激活 400;临时用户/token/激活码已清理
- 公网未认证调用 `/api/activate-course`:401
- 生产前端 bundle 已包含 `/login?redirect=/activate`

仍需人工完成下文 6 项“手工验证”;其中短信、登录态、页面跳转和视频播放需要真实手机号和浏览器环境。

## Context

当前 `/activate` 页面无论用户是否登录,都强制要求填写**手机号 + 短信验证码**(`src/pages/Activate.jsx:203-254`)。已登录用户虽然手机号会自动填入且不可编辑(`:215`),但仍必须点「获取验证码」、等短信、再输入——对已经完成过一次身份验证的用户,这是纯粹的重复劳动,而且每次都白白消耗一条真实短信费用。

目标流程:

| 场景 | 改造后 |
|---|---|
| **已登录** | 只输激活码,直接激活。不再需要手机号和验证码 |
| **未登录** | 先跳登录页,登录/注册完成后自动回到激活页继续 |

### 关键约束(已与产品方确认)

**`api/login.js:35-40` 不会自动建号** —— 用户不存在时返回 404「请先注册或激活课程」。也就是说**现在的激活流程本身承担着注册职能**:淘宝买家拿到激活码,一步即可开通账号(`activate-course.js:82-90` 会自动创建用户)。

改为"先登录"后,新用户变成两步。**已确认的处理方式**:未登录 → 跳 `/login?redirect=/activate`,登录页突出「没有账号?去注册」按钮(同样带 redirect),注册完成自动回到激活页。

**Token 处理**:**已确认不重新签发**。当前 `activate-course.js:111-118` 会删旧 token、签新 token;在已登录路径下这属于无谓的会话更替,还可能把用户在其他标签页踢下线。改造后已登录激活只给账号加课程,不动 token。

---

## 实施方案

### 1. 新增 `api/_auth.js` —— 抽出鉴权链

把 `api/check-course-access.js:27-82` 中**已在生产验证过**的鉴权逻辑抽成共享模块,**不要重写一遍**:

```js
// 取 Bearer token → jwt.verify → Redis token:{jwt} 存在 → deviceId 匹配 → 取 user
export async function authenticate(req) {
  // 成功: { ok: true, phone, token, user }
  // 失败: { ok: false, status, error, kicked? }
}
```

要点:

- 完整复用现有四步校验,**包括** `token:{jwt}` 在 Redis 中的存在性检查(这是**单设备登录**的真相源,JWT 验签通过还不够)和 `tokenInfo.deviceId !== decoded.deviceId` 的设备指纹比对
- 保留 `kicked: true` 语义 —— 前端 `ProtectedRoute.jsx:52` 依赖它来提示「账号已在其他设备登录」
- `JWT_SECRET` 直接读 `process.env.JWT_SECRET`,**不要沿用现有的硬编码兜底值** `'development-secret-key-change-in-production'`

> 这个模块正是 `doc/MIGRATION_ALIYUN.md`「阶段二第 2 项」规划的复用点。本次先建起来,后续 `get-video-url.js`(**目前完全无鉴权**,任何人可对任意 OSS 对象换取签名 URL)可以直接接入。

### 2. 改造 `api/activate-course.js`

- **强制认证**:开头调用 `authenticate(req)`,失败直接返回 401。**删除** `:26-47` 那段「有 token 就顺便校验手机号一致、失败就忽略继续」的宽松逻辑
- **入参**从 `{ activationCode, phone, smsCode, deviceId, deviceName }` 收敛为 `{ activationCode }`;`phone` 改从 token 取
- **删除** `verifySmsCode` 调用(`:50`)及 `_verify-sms.js` 的 import
- **删除**签发新 token 的整段(`:99-118`、`:127-132`),以及响应里的 `token` 字段
- **保留**激活码三项校验(不存在 / 已使用 / 已过期)和加课程逻辑
- 用户必然已存在(能通过认证),删掉 `:82-90` 的自动建号分支

**顺带修复激活码竞态**:`:56` 读、`:135` 写之间非原子,并发或双击可能让同一码被使用两次。因为这段代码本来就要重写,用一段 Redis Lua 脚本把「读取 → 校验 `used` → 标记已用」合并为原子操作。校验失败时脚本返回失败原因,由 handler 转成对应错误响应。

### 3. 新增 `src/utils/safeRedirect.js`

`?redirect=` 参数**必须校验**,否则 `?redirect=https://evil.com` 就是开放重定向漏洞(钓鱼跳板):

```js
// 只接受站内绝对路径:以 / 开头,且不以 // 或 /\ 开头
export function safeRedirect(value, fallback = '/my-courses') { ... }
```

### 4. 改造 `src/pages/Activate.jsx`

- 未登录时 `return <Navigate to="/login?redirect=/activate" replace />`
- 表单**只保留激活码**一个字段。删除:
  - 手机号输入(`:203-225`)
  - 验证码输入与发送按钮(`:227-254`)
  - `handleSendSMS`(`:45-92`)
  - 倒计时 state 与 effect(`:16`、`:34-39`)
  - 自动填手机号的 effect(`:27-31`)
- 提交时带 `Authorization: Bearer ${token}`,body 只有 `{ activationCode }`
- 成功后**不再调用** `login()`(token 未变),直接 `navigate('/my-courses')`
- 删除底部「已有账号?去登录」链接(`:274-280`)——改造后未登录根本到不了这个页面,是死链
- 页面副标题从「输入激活码和手机号即可开始学习」改为只提激活码

### 5. 改造 `src/pages/Login.jsx` 与 `src/pages/Register.jsx`

两个文件套用同一套模式:

- `useSearchParams()` 读 `redirect`,经 `safeRedirect()` 过滤
- 登录/注册成功后跳该路径(替换 `Login.jsx:125`、`Register.jsx:122` 的硬编码 `navigate('/my-courses')`)
- 已登录时的自动跳转同样处理(`Login.jsx:27`、`Register.jsx:27`)
- 页面互跳链接要**透传 redirect**:`Login.jsx` 的「去注册」、`Register.jsx:243` 的「去登录」
- 当 `redirect` 指向 `/activate` 时,页面顶部提示「登录后即可激活课程」,让用户明白为什么被要求登录

`Login.jsx:246` 和 `Register.jsx:252` 现有的「去激活」链接在新流程下语义变了(未登录点进去会被弹回来),需要相应调整文案或移除。

### 6. 明确不需要改动的地方

`ProtectedRoute.jsx:139`、`MyCourses.jsx:168`、`Header.jsx:92`、`Navigation.jsx:129` 的 `to="/activate"` 链接**保持原样** —— 未登录用户点进去,由 Activate 页面自己重定向到登录页。不要为它们逐个加判断。

---

## 验证

### 自动化测试

**新增 `src/utils/safeRedirect.test.js`**(纯函数,无依赖):

- `/my-courses` → 放行
- `https://evil.com`、`//evil.com`、`/\evil.com` → 全部回落到默认值

**新增 `api/activate-course.test.js`**,用 `vi.mock('./_redis.js')` 模拟 Redis,覆盖三个分支:

- 无 `Authorization` 头 → 401,且**没有**调用短信校验
- 激活码已被使用 → 400
- 正常激活 → 成功,用户 `courses` 增加了 `courseId`,**响应中不含 `token` 字段**

现有 `server.test.js` 的路由挂载检查应继续通过(路由数量和顺序不变)。

### 手工验证(需真实手机号)

1. **已登录用户**:登录 → `/activate` → 页面只有一个激活码输入框 → 输码提交 → 成功 → `/my-courses` 出现新课程。**全程无短信**,且刷新后仍是登录态(token 未变)
2. **未登录老用户**:退出 → 访问 `/activate` → 自动跳 `/login?redirect=/activate` → 登录 → **自动回到 `/activate`** → 输码激活
3. **未登录新用户**:无痕窗口 → `/activate` → 跳登录页 → 点「去注册」→ 注册 → 自动回 `/activate` → 输码激活
4. **开放重定向防护**:手动访问 `/login?redirect=https://example.com`,登录后应跳到 `/my-courses` 而非外站
5. **重复激活**:同一激活码再次提交 → 提示已被使用
6. **并发防护**:快速双击提交按钮 → 只成功一次

### 部署

```bash
npm run lint && npx vitest run && npm run build
DEPLOY_HOST=8.133.195.118 DEPLOY_KEY_PATH=./sh-mayin.pem ./deploy.sh
```

线上冒烟:未登录访问 `https://mayinfriday.icdiary.com/activate` 应跳转到登录页。

> **本机 DNS 会被代理劫持**:验证线上时用 `curl --resolve mayinfriday.icdiary.com:443:8.133.195.118 ...`,直接 `curl` 域名会走 Surge/Clash 的 fake-IP。详见 `doc/MIGRATION_ALIYUN.md`。

---

## 注意事项

**这是破坏性 API 变更**:`/api/activate-course` 不再接受 `phone + smsCode`。项目是单一前端、无外部调用方,且前后端同批部署,因此不需要过渡期。但**部署时前端和后端必须一起更新** —— `deploy.sh` 已经是同批推送 `dist/` 和 `api/`,天然满足这一点。

**存量用户不受影响**:改造不触碰 `user:{phone}`、`token:{jwt}` 的数据结构,已登录用户的会话继续有效。

**短信成本会下降**:改造后老用户激活不再触发短信,只有登录/注册环节需要。

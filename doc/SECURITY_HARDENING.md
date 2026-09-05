# 安全加固:后台密码传输 与 HLS 课程视频防盗

> 方案日期:2026-09-05
> 状态:代码、Nginx 与 OSS 权限已上线;管理员密码和 OSS AccessKey 轮换、浏览器真机验收待执行
> 两部分互相独立,可分别实施。**建议先做第一部分**(改动小、当天可完成),第二部分需要动 OSS 配置

---

## 背景

`doc/MIGRATION_ALIYUN.md` 的「阶段二」列出了一批既有安全问题。迁移和激活流程优化完成后,以下两项优先级最高:

| # | 问题 | 影响 |
|---|---|---|
| **一** | 管理员密码经 URL query 传递,仅 8 字符,接口无限流,`/admin/*` 无前端守卫 | 后台可被暴力破解 |
| **二** | HLS 课程视频为公共读,m3u8 URL 硬编码在前端 JS 里 | **付费课程可被任意白嫖,直接影响收入** |

第二项已现场复现:未携带任何 token 调用 `/api/get-video-url` 即可为任意 OSS 路径换取 24 小时签名 URL;而 HLS 视频甚至不需要签名,URL 就在打包后的 JS 里。

---

# 第一部分:后台密码加固

## 现状

`api/admin.js:8-17` 与 `api/orders.js:10-12,73`:

```js
function isAdminPassword(value) {
  return value === (process.env.ADMIN_PASSWORD || 'admin123')   // 硬编码兜底
}

function requireAdmin(req, res) {
  const password = req.method === 'GET' ? req.query.adminPassword : req.body?.adminPassword
  //                                      ^^^^^^^^^^^^^^^^^^^^^^ 密码进 URL
  ...
}
```

前端 11 处调用中,**4 处 GET 把密码放在 URL query**:

| 文件 | 行号 |
|---|---|
| `src/pages/AdminCodes.jsx` | 37 |
| `src/pages/AdminMembers.jsx` | 47 |
| `src/pages/AdminProducts.jsx` | 65 |
| `src/pages/AdminOrders.jsx` | 23 |

其余 7 处 POST 已经放在 body 里,本身无日志泄漏问题。

**四个弱点叠加**:密码进 URL(浏览器历史、Referer、日志)+ 仅 8 字符 + 无限流 + `/admin/*` 前端无守卫。当前靠 Nginx 的 `admin_safe` log_format 做了日志脱敏,属于临时缓解。

> 好消息:密码只存在 React `useState` 里(`AdminCodes.jsx:9`),**不落 localStorage**,刷新即失效。这点无需改动。

## 改造

### 1.1 后端:密码改走请求头

`api/admin.js` 与 `api/orders.js` 共用同一份逻辑,建议抽到新的 `api/_admin-auth.js`:

```js
/* global process */
import crypto from 'node:crypto'
import redis from './_redis.js'

const MAX_ATTEMPTS = 10
const WINDOW_SECONDS = 900   // 15 分钟

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

export async function requireAdmin(req, res) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    // 不再提供 'admin123' 兜底 —— 未配置时直接拒绝,而不是退到人人皆知的默认值
    res.status(500).json({ success: false, error: '服务未配置管理员密码' })
    return false
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  const attemptKey = `admin:fail:${ip}`

  const fails = Number(await redis.get(attemptKey)) || 0
  if (fails >= MAX_ATTEMPTS) {
    res.status(429).json({ success: false, error: '尝试次数过多，请稍后再试 / Too many attempts' })
    return false
  }

  const supplied = req.headers['x-admin-password'] || ''
  if (!timingSafeEqual(supplied, expected)) {
    await redis.multi().incr(attemptKey).expire(attemptKey, WINDOW_SECONDS).exec()
    res.status(401).json({ success: false, error: '管理员密码错误 / Invalid admin password' })
    return false
  }

  await redis.del(attemptKey)   // 成功后清零
  return true
}
```

要点:

- **只读 `x-admin-password` 请求头**,不再读 query 或 body
- **删除 `|| 'admin123'` 兜底** —— 未配置时拒绝服务,而不是退到默认密码
- **限流**:同一 IP 15 分钟内失败 10 次即锁定。实现优先读取 Nginx 覆盖设置的 `X-Real-IP`;缺失时才取 `X-Forwarded-For` 最后一个地址。不能取第一个地址,因为当前 `$proxy_add_x_forwarded_for` 会保留客户端自带值,第一个地址可被伪造绕过限流
- **timing-safe 比较**:成本极低,顺手做掉

`api/admin.js:12-17` 的 `requireAdmin` 与 `api/orders.js:73` 的内联校验都改为调用这个共享函数。注意 `orders.js` 的 `createOrder` 是**面向普通顾客的公开接口**,不要误加鉴权。

### 1.2 前端:4 个后台页面统一改造

模式(以 `AdminCodes.jsx:37` 为例):

```js
// 改造前
const res = await fetch(`/api/admin?action=listCodes&adminPassword=${encodeURIComponent(pwd)}`)

// 改造后
const res = await fetch('/api/admin?action=listCodes', {
  headers: { 'x-admin-password': pwd },
})
```

7 处 POST 调用同样把 body 里的 `adminPassword` 字段移到 header,保持一致(否则后端要兼容两种来源,徒增复杂度)。

前端需要额外处理 **429** 状态:提示「尝试次数过多,请 15 分钟后再试」,而不是笼统显示「密码错误」。

### 1.3 运维动作(不属于代码改动)

- **把 `ADMIN_PASSWORD` 换成 20+ 字符的强随机值**:
  ```bash
  node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
  ```
  改服务器 `/var/www/web-mayfriday/app/.env` 后 `pm2 reload web-mayfriday`
- 改完后可以**撤掉 Nginx 的 `admin_safe` log_format**(密码不再进 URL,脱敏 hack 不再必要),但保留也无害

---

# 第二部分:HLS 课程视频防盗

## 现状

**当前完全没有保护。** `VideoPlayer.jsx:25-27` 的注释写得很直白:

```js
if (isHLS) {
  // HLS 文件已设为公共读取，直接使用
  setVideoUrl(video.src)
}
```

因为 HLS 判断在 OSS 判断之前,**8 处视频引用全部走这条分支**,`/api/get-video-url` 实际上是死代码路径。m3u8 的完整 URL 就硬编码在打包后的 JS 里,任何人打开 DevTools 就能拿到并直接播放。

### 视频清单(6 个不同的 playlist)

| 路径 | 归属 | 是否付费 |
|---|---|---|
| `courses/course1/playlist.m3u8` | 课程 1(被 3 个课时复用) | **付费** |
| `courses/course2/inkle-basics/playlist.m3u8` | 课程 2 | **付费** |
| `courses/course3/playlist.m3u8` | 课程 3 | **付费** |
| `resources/1/hls/playlist.m3u8` | 公开资源文章 | 公开 |
| `resources/mini-heddle-latvia-pattern/playlist.m3u8` | 公开资源文章 | 公开 |
| `resources/ipad-bag-crochet-tutorial/playlist.m3u8` | 公开资源文章 | 公开 |

引用位置:`src/data/courses/course1.js:313,331,349`、`course2.js:2`、`course3.js:2`、`src/data/resources.js:76,377,512`。

> **关键区分**:`resources/` 下 3 个视频是**公开文章**内容(`src/App.jsx` 中 `resources/:slug` 路由没有 `ProtectedRoute` 包裹)。**不能把整个 bucket 一刀切改私有**,否则公开教程和缩略图会一起挂掉。

### 三个技术约束

**① m3u8 里的分片是相对路径。** 切片命令(`COURSE_WORKFLOW.md`)产出的 playlist 形如:

```
#EXTINF:12.833333,
segment-000.ts
```

没有域名、没有目录。浏览器按 playlist 的 base URL 解析。**这意味着给 playlist 加签名 query 后,分片请求不会继承签名** —— 必须重写 playlist 内容,把每个分片替换成各自的完整签名 URL。

**② 分片数量大。** course1/course2 各 99 片,course3 达 **284 片**。所以必须在重写 playlist 时**一次性签完**,不能逐片向后端请求。好在 `signatureUrl()` 是纯本地 HMAC 计算,签 284 次的开销可以忽略。

**③ iOS Safari 绕过 hls.js。** `VideoPlayer.jsx:75-78`:

```js
} else if (isHLS && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
  videoRef.current.src = videoUrl        // 原生播放器
}
```

原生播放器**无法注入请求头**,也**不支持 blob: URL 形式的 HLS**。所以鉴权信息必须能放进 URL 本身。`VideoPlayer.jsx:54` 那个 `xhrSetup` 目前只写了 `xhr.withCredentials = false`,是个空壳,对 iOS 分支也无能为力。

## 改造方案

核心思路:**OSS 只把 `courses/` 前缀改私有;playlist 由后端鉴权后重写并逐片签名;用短期播放令牌让 URL 自带鉴权,兼容 iOS 原生播放器。**

流量结构不变——**分片仍由浏览器直连 OSS**,只有体积极小的 playlist 经过 ECS,不会增加服务器带宽压力。

### 2.1 OSS 权限调整

- Bucket `web-mayfriday-videos` 默认改为**私有读**
- 用 **Bucket Policy** 对 `resources/*` 前缀开放匿名 `GetObject`,保住 3 个公开视频
- **上线前务必确认缩略图的位置**:`resources.js:77,378,513` 的缩略图在 `resources/` 下(不受影响),但课程封面若也在 `courses/` 下且由 `<img>` 直连,会一起 403。需要逐一排查 `src/data/courses/*.js` 里的图片 URL,把公开展示用的图单独放行或迁到 `public/`

### 2.2 新增 `/api/video-token` —— 换取短期播放令牌

```
POST /api/video-token   { path: "courses/course1/playlist.m3u8" }
Authorization: Bearer <用户 JWT>
→ { token: "<短期令牌>", expiresIn: 300 }
```

- 用 `api/_auth.js` 的 `authenticate(req)` 鉴权(激活流程改造时已建好,直接复用)
- 从 path 提取 courseId:正则 `^courses/(course\d+)/`
- 复用 `api/check-course-access.js` 的权限判断:`isMembershipActive(user.membership)` 或 `user.courses.includes(courseId)`
- 通过后签发一个**5 分钟有效**的 JWT,payload 含 `{ path, phone }`,用同一个 `JWT_SECRET`
- `resources/` 前缀的 path 直接放行(公开内容),不要求登录

### 2.3 新增 `/api/hls-playlist` —— 重写并签名

```
GET /api/hls-playlist?path=courses/course1/playlist.m3u8&t=<短期令牌>
→ Content-Type: application/vnd.apple.mpegurl
```

- 校验 `t` 令牌有效且 `payload.path === path`(防止拿 course1 的令牌去取 course3)
- 用 `ali-oss` SDK 拉取 m3u8 原文
- **逐行重写**:跳过 `#` 开头的指令行和空行,其余每行是分片文件名 → 替换为 `client.signatureUrl(dirname + '/' + 行内容, { expires })`
- 分片签名有效期建议 **4 小时**(最长视频 course3 约 47 分钟,留足余量)
- 返回重写后的文本,并设 `Cache-Control: no-store`

### 2.4 改造 `src/pages/../VideoPlayer.jsx`

HLS 分支改为:

1. 先 `POST /api/video-token`(带 `Authorization`)换令牌
2. 把 `/api/hls-playlist?path=..&t=..` 这个**同源 URL** 交给播放器
3. hls.js 走 `hls.loadSource(url)`;iOS 原生走 `video.src = url` —— **同一个 URL 两条分支都能用**,因为鉴权信息在 query 里

**必须删除 `VideoPlayer.jsx:100-105` 的失败回退**:

```js
} catch (err) {
  setError(err.message)
  setVideoUrl(video.src)    // ← 删掉这行:鉴权失败后仍把裸 OSS URL 交给播放器
}
```

鉴权失败时应显示「请先购买本课程」之类的提示,而不是降级到未签名 URL。

`resources/` 下的公开视频保持现状直连即可,不必走令牌流程(判断 path 前缀分流)。

### 2.5 顺带修 `api/get-video-url.js`

即使 HLS 改造后它仍是死代码路径,**也必须加鉴权** —— 端点公开可达,任何人仍可直接调用。加上 `authenticate(req)` + 路径前缀白名单,或者确认无人使用后直接从 `server.js:47` 摘掉路由。

---

## 实施记录（2026-09-05）

- 已新增 `api/_admin-auth.js`,后台密码只接受 `x-admin-password`,删除默认密码,加入 Redis 限流与 timing-safe 比较
- 四个后台页面的 11 处请求已统一改为请求头传递密码
- 已新增 `/api/video-token` 和 `/api/hls-playlist`;只允许清单中的 3 个付费 playlist,令牌绑定用户与路径,playlist 中的媒体 URI 逐项签名
- `/api/get-video-url` 已加登录、课程权限和 `courses/` 路径限制,签名期从 24 小时缩短为 4 小时
- `VideoPlayer` 已删除鉴权失败后回退裸 OSS URL 的逻辑;桌面 hls.js 与 iOS 原生 HLS 使用同一个受保护入口
- Nginx 对 `/api/hls-playlist` 关闭 access log,避免 URL 中的 5 分钟播放令牌进入日志
- `upload-mini-heddle-video.sh` 已改为读取 `OSS_ACCESS_KEY_ID` / `OSS_ACCESS_KEY_SECRET`,不再硬编码密钥
- 已部署代码和 Nginx;`/api/hls-playlist` 不进入 access log;PM2 与公网 `/healthz` 正常
- Bucket 已从 `public-read` 改为 `private`,并设置 `deploy/oss/resources-public-read-policy.json`:只对 `resources/*` 匿名开放 `GetObject`
- 生产冒烟结果:3 个课程裸 playlist 均为 403;3 个受保护 playlist 均为 200 且分片签名有效;3 个公开资源 playlist 均为 200;管理员请求头鉴权为 200,URL 中的旧默认密码为 401
- 自动化结果:`26 passed`;生产构建成功。全仓库 lint 仍被 61 个既有问题阻塞,本次新增和修改的安全文件定向 lint 已通过
- 尚未执行:轮换当前仍为 8 字符的管理员密码、轮换曾硬编码的 OSS AccessKey、四个后台页面手工验收、Chrome 已购/未购播放验收与 iOS Safari 真机验收

## 验证

### 第一部分

自动化:
- `api/_admin-auth.test.js`:密码正确 → 放行;错误 → 401 且失败计数 +1;失败 10 次后 → 429;`ADMIN_PASSWORD` 未设置 → 500(**不能**因为传了 `admin123` 就放行)

手工:
1. 四个后台页面(`/admin/codes`、`/admin/members`、`/admin/products`、`/admin/orders`)输入正确密码均可正常读写
2. 浏览器 Network 面板确认**请求 URL 里不再出现 `adminPassword`**
3. 连续输错 10 次 → 收到 429,等 15 分钟后恢复
4. 服务器 `.env` 临时移除 `ADMIN_PASSWORD` → 接口返回 500 而非放行

### 第二部分

自动化:
- `/api/video-token`:无 token → 401;有 token 但未购买该课程 → 403;已购买 → 返回令牌;`resources/` 路径 → 免登录放行
- `/api/hls-playlist`:令牌与 path 不匹配 → 403;正常 → 返回内容以 `#EXTM3U` 开头,且**每个分片行都是带 `Signature=` 的完整 URL**

手工(**这部分必须真机验证,自动化覆盖不到播放器行为**):
1. **已购课用户**:Chrome 播放 course1/course2/course3,全部正常
2. **iOS Safari 真机**:同样三个课程正常播放 —— 这是最容易出问题的一环,原生播放器行为与 hls.js 差异大
3. **未购课用户**:进入课程页 → 提示无权限,**且 Network 里没有任何可用的 OSS 分片 URL**
4. **直接访问原 OSS URL**:`https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/courses/course1/playlist.m3u8` → 应返回 **403**
5. **公开资源不受影响**:`/resources/mini-heddle-latvia-pattern` 等 3 篇文章的视频仍可免登录播放
6. **长视频**:完整播放 course3(约 47 分钟)不中断 —— 验证 4 小时签名有效期足够
7. **课程封面与缩略图**:全站排查是否有图片因 bucket 转私有而 403

### 部署

```bash
npm run lint && npx vitest run && npm run build
DEPLOY_HOST=8.133.195.118 DEPLOY_KEY_PATH=./sh-mayin.pem ./deploy.sh
```

> **OSS 权限变更没有灰度**。建议先在测试路径验证签名逻辑,再切 bucket ACL;切换后立刻跑上面第 4、5 项。

---

## 注意事项

**分片签名可被转发**:重写后的 playlist 在 4 小时内被复制出去仍然可用。这是签名 URL 方案的固有限制,把门槛从「零成本」提到「需要主动分发且 4 小时失效」,对本项目规模足够。若日后要更强的保护,再考虑**阿里云 CDN 鉴权 + HLS 标准加密**(CDN 可自动改写 m3u8 内的分片鉴权参数,并支持 AES 加密分片),代价是引入 CDN 配置和费用。

**Lua 与集群**:无关本次改动,但 `api/activate-course.js` 的 Lua 脚本用了两个 key,依赖 Redis 非集群架构。当前是标准版单分片,成立。

**顺带的卫生问题**:`upload-mini-heddle-video.sh:25-30` 明文硬编码了 OSS AccessKey。已确认该文件**未被 git 跟踪、AccessKey 从未进入 git 历史**(`git log --all -S` 无命中),所以没有泄漏到 GitHub。但仍建议改为读环境变量(`upload-oss.py` 已是正确做法),并在方便时轮换该 AccessKey。

# 隐藏「图案」与「会员」功能

> 方案日期:2026-09-05
> 状态:待实施
> 影响范围:3 个前端文件,**后端一律不动**

## Context

站点当前对外展示「图案」(`/patterns`) 和「会员」(`/membership`) 两块功能,但业务上暂不提供。需要把它们从用户可见范围移除,同时**保留全部代码和数据**,将来能低成本恢复。

### 已确认的三个决定

| 决定 | 选择 | 含义 |
|---|---|---|
| 隐藏程度 | **藏入口 + 路由重定向首页** | 页面与数据文件全部保留;URL 直达也进不去,搜索引擎不会再收录 |
| 后端会员授权 | **保留** | `check-course-access.js:37`、`_video-access.js:36` 不动 —— 已授予的会员权益继续有效,不会有用户突然看不了课 |
| `/admin/members` | **保留** | 后台不对外开放,仍可手工授予/取消会员(比如对已付费用户做补偿) |

### 调研结论(实施前请先读,能省掉两次返工)

- **`patterns` 在 `src/data/courses.js`、`shared/products.js`、`src/data/resources.js` 里只是英文描述中的普通词**(如 `"5 scarf patterns"`、`"...before Sámi patterns"`),**不是功能引用,不要动这三个文件**
- `Footer.jsx`、`Header.jsx` 均无指向这两个路由的链接,不需要改
- `MyCourses.jsx:129-140` 的会员状态展示**只在 `membershipActive` 为真时渲染**,非会员本来就看不到 —— 保持原样

---

## 实施方案

改动集中在 3 个文件。

### 1. `src/App.jsx` —— 路由改为重定向

```jsx
<Route path="patterns" element={<Navigate to="/" replace />} />
<Route path="membership" element={<Navigate to="/" replace />} />
```

`Navigate` 需要加进第 2 行的 `react-router-dom` import。

**同时必须删除 `Patterns`(:7)和 `Membership`(:11)的 import** —— 本项目 ESLint 把 `no-unused-vars` 当 **error**,留着会直接导致 lint 失败。这是本次最容易踩的坑。

> 副作用(正面):这两个页面及其数据文件从此无人引用,Vite 会 tree-shake 掉,主 bundle 体积会下降。这是可测量的验证点,见下文。

### 2. `src/components/common/Navigation.jsx` —— 移除两个导航项

删除第 15 行(`/patterns`)和第 18 行(`/membership`)两个数组元素。

`src/utils/i18n.js` 里的 `nav.patterns` / `nav.membership` 翻译键**保留不动** —— 未使用的键无害,留着能让恢复更简单。

### 3. `src/pages/Home.jsx` —— 移除两个区块和相关引用

**按从下往上的顺序删,避免行号偏移**:

| 范围 | 内容 |
|---|---|
| `:303-348` | 整个 "Featured Patterns" section(含「浏览所有图案」按钮) |
| `:265-301` | 整个 "Membership CTA" section(含「查看会员计划」按钮) |
| `:70-72` | 首屏的「成为会员」按钮(**保留**紧邻的「浏览课程」按钮) |
| `:51` | `popularPlan` 变量 |
| `:49` | `featuredPatterns` 变量 |
| `:7` | `import { membershipPlans } from '../data/membership'` |
| `:5` | `import { patterns } from '../data/patterns'` |

**两个注意点**:

- `Card` 组件在 Home.jsx 用了 3 处(`:220` 课程、`:320` 图案、`:368` 文章),删掉图案块后仍有 2 处使用,**`Card` 的 import 要保留**
- `:170` 的文案「文章、教程、图案库」/ `"Articles, tutorials, patterns"` 是「丰富资源」特性卡里的描述文字,不是链接。图案功能既然下线,建议改为「文章、教程、素材」/ `"Articles, tutorials, resources"`,避免承诺不存在的内容

### 明确不改动的部分

不要"顺手清理"以下内容——它们是刻意保留的:

- `src/pages/Patterns.jsx`、`src/pages/Membership.jsx`
- `src/data/patterns.js`、`src/data/membership.js`
- `src/pages/MyCourses.jsx` 的会员状态展示
- `src/pages/AdminMembers.jsx` 与 `/admin/members` 路由
- `api/_membership.js`、`api/check-course-access.js`、`api/get-user-courses.js`、`api/_video-access.js`、`api/admin.js` —— **后端一律不动**
- `src/utils/i18n.js` 的翻译键

---

## 验证

### 自动化

现有 32 项测试应全部继续通过(本次不涉及后端逻辑)。`src/App.test.jsx` 会渲染整个 App,能捕捉路由配置错误。

改动文件 lint 必须零错误 —— **特别检查 `App.jsx` 有没有残留未使用的 import**。

### 手工验证

1. **导航栏**不再出现「图案」和「会员」两项(**中英文都要切换看**)
2. **首页**不再有:首屏「成为会员」按钮、会员 CTA 区块、热门图案区块;删除后页面上下衔接自然,无断层或多余空白
3. 直接访问 `/patterns` 和 `/membership` → **跳转到首页**
4. `/my-courses`、`/courses`、`/tools`、`/resources` 等其余页面不受影响
5. **已有会员权益未受影响**:用一个有会员权益的账号确认仍能访问全部课程(若当前没有会员账号,可在 `/admin/members` 临时授予一个,验证后再取消)
6. `/admin/members` 后台仍可正常打开和操作

### bundle 体积(可量化的确认)

删掉 import 后 `Patterns.jsx`、`Membership.jsx`、`data/patterns.js`、`data/membership.js` 会被 tree-shake。构建后主 JS 应当比当前的 **985 kB 有可见下降**;若体积几乎没变,说明 import 没删干净或还有别处在引用,需要回头查。

### 部署

```bash
npm run lint && npx vitest run && npm run build
DEPLOY_HOST=8.133.195.118 DEPLOY_KEY_PATH=./sh-mayin.pem ./deploy.sh
```

线上冒烟(**本机 DNS 被 Surge/Clash 劫持,必须用 `--resolve`**):

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  --resolve mayinfriday.icdiary.com:443:8.133.195.118 \
  https://mayinfriday.icdiary.com/patterns
```

> 这里期望的是 **200**,不是 3xx。重定向由 React Router 在客户端完成,服务端始终返回 `index.html` —— 这是 SPA 的正常表现,**不要误判为失败**。要确认跳转真的生效,必须在浏览器里实际访问。

---

## 恢复方式

将来要恢复,只需回滚这 3 个文件:`App.jsx` 的两个 import 与路由、`Navigation.jsx` 的两个数组元素、`Home.jsx` 的两个区块与引用。页面、数据、后端逻辑、翻译键全程未动。

**实施时请单独提交一个 commit**,不要和其他改动混在一起 —— 恢复时直接 `git revert` 即可。

# 从 Vercel 迁移到阿里云国内服务器

> 调研日期:2026-09-03
> 最后更新:2026-09-04
> 状态:应用已部署,HTTPS 公网验收通过;等待浏览器完整业务链路和数据初始化
> 环境:阿里云华东2(上海)可用区 B,Alibaba Cloud Linux 4

## 当前实际进度

以下是已经实际执行和验证的结果,不是待办示例。

### ECS 与连接方式

| 项目 | 当前值 |
|---|---|
| ECS 公网 IP | `8.133.195.118` |
| ECS 私网 IP | `172.19.244.20` |
| 登录用户/端口 | `root` / `22` |
| VPC | `vpc-uf602u6ijuj28gdh7tbxl` |
| 系统 | Alibaba Cloud Linux 4.0.5 OpenAnolis,x86_64 |
| 本地 / 服务器 Node | 本地 `20.18.0` / 服务器 `22.23.0` |
| Nginx / PM2 | Nginx `1.30.4` / PM2 `7.0.4` |
| 内存 / Swap | 1.6GiB / 4GiB(实例原本已有) |
| 应用目录 | `/var/www/web-mayfriday/app` |
| 静态目录 | `/var/www/web-mayfriday/dist` |

本地仓库根目录连接命令:

```bash
ssh -i ./sh-mayin.pem -p 22 root@8.133.195.118
```

实际私钥文件是仓库根目录下的 `./sh-mayin.pem`,不是系统根目录的 `/sh-mayin.pem`。文件权限已设为 `600`,并由 `.gitignore` 的 `*.pem` 规则排除;不得提交或发送私钥内容。

> **Node 版本差异(低风险)**:`package-lock.json` 由本地 Node `20.18.0` 生成,生产服务器运行 Node `22.23.0`。当前依赖没有原生二进制模块,Express、ioredis、ali-oss 均已在 Node 22 上完成安装和运行验证,因此不阻塞上线。后续若出现只在生产环境复现的依赖或运行时问题,应先把 Node 主版本差异列入排查范围;长期建议统一本地和服务器版本。

部署命令:

```bash
DEPLOY_HOST=8.133.195.118 DEPLOY_KEY_PATH=./sh-mayin.pem ./deploy.sh
```

### Redis 实际配置

| 项目 | 当前值 |
|---|---|
| 产品/版本 | Redis 开源版 7.0,标准版,1GB,1 主 1 备 |
| 地域/主可用区 | 华东2(上海) / 可用区 B |
| VPC | `vpc-uf602u6ijuj28gdh7tbxl`(与 ECS 一致) |
| 内网地址 | `r-uf6sy3sqwcvpzfh6uf.redis.cn-shanghai.rds.aliyuncs.com` |
| 端口 | `6379` |
| 账号 | `r-uf6sy3sqwcvpzfh6uf` |
| 登录方式 | 用户名 + 密码 |
| ECS 白名单 IP | `172.19.244.20` |
| 连通验证 | ECS 内执行 `PING`,已返回 `PONG` |

密码只保存在本地忽略文件 `.env.aliyun` 和服务器 `/var/www/web-mayfriday/app/.env` 中,不得写入本文档。服务器 `.env` 权限已设为 `600`。

### 已完成

- [x] ECS 与 Redis 采购,VPC 一致
- [x] 安装 Node.js、Nginx、PM2、rsync
- [x] Nginx 与 PM2 设置开机启动
- [x] 创建部署目录,上传生产 `.env`
- [x] 完成 Express、Redis、`DIST_DIR`、PM2 和部署脚本改造
- [x] 首次构建并部署约 94MB 静态资源及服务端代码
- [x] PM2 进程 `web-mayfriday` 为 `online`,验证时 0 次重启
- [x] 本机 `/healthz`、首页、`/api/products` 均返回 HTTP 200
- [x] Redis 鉴权和内网连接验证通过:`PING` → `PONG`
- [x] 确认生产 `.env` 未设置 `EXPOSE_SMS_CODE=true`,不会向前端返回明文验证码
- [x] 确认 `ADMIN_PASSWORD` 已显式配置且不是代码兜底值 `admin123`;错误密码请求 `/api/admin` 返回 401
- [x] 本地测试通过:2 个测试文件、5 个测试
- [x] Nginx 正式配置已启用,HTTP 301 跳转 HTTPS
- [x] Let's Encrypt 证书已签发,有效期至 2026-12-02
- [x] Certbot 自动续期 timer 已启用,模拟续期成功
- [x] HTTPS 公网验收通过:首页、`/healthz`、JSON API、SPA fallback 均正常
- [x] 修复主 JS 包未 gzip 的问题(见下)
- [x] 代码改动已提交:分支 `migrate/aliyun-deployment`,commit `5743f61`(代码 13 文件)+ `341a5cb`(部署配置与文档 7 文件)

### 服务器健康检查(2026-09-04 实测)

| 项目 | 结果 |
|---|---|
| PM2 `web-mayfriday` | `online`,运行 8 小时,**重启 0 次**,内存 100.6 MB |
| 端口监听 | Nginx `0.0.0.0:80/443`;Node **仅** `127.0.0.1:3000` ✓ |
| certbot 续期 timer | `enabled` + `active`,每日两次 |
| `.env` | 权限 `600`;12 项变量全部配齐;`EXPOSE_SMS_CODE` 未开启;`JWT_SECRET` 64 字符 |
| 短信通道 | `SMS_*` 四项均已配置,不会退回 `_sms.js` 的测试模式 |
| OSS 签名 | `/api/get-video-url` 返回合法签名 URL,OSS 回 404(凭证有效,仅测试文件不存在) |
| 资源 | 内存 525/1671 MB,Swap 未使用,磁盘 8.3G/40G(23%) |
| 日志 | PM2 无错误;Nginx 仅有 reload 通知 |

> **PM2「重启 0 次」是关键指标** —— 印证了 `api/_redis.js` 的 `error` 监听生效。修复前 ioredis 的 error 事件无监听会直接 crash 整个 Node 进程。

**上线后仍待处理的两项(非阻塞)**:

- `ADMIN_PASSWORD` 仅 8 字符,且经 URL query 传递、`/admin/*` 前端路由无守卫、接口无限流。建议加长到 20+ 字符,并按阶段二第 3 项把它移到请求头。
- `/api/get-video-url` 无鉴权已现场复现:未携带任何 token 即可为**任意 OSS 路径**换取 24 小时签名 URL。详见阶段二第 2 项。

### 上线后修复:主 JS 包未被 gzip 压缩

**发现时间**:2026-09-04 上线验收时,实测线上 `assets/index-*.js` 响应无 `content-encoding`,`content-length` 为 987896 字节。CSS 和 HTML 均正常压缩,唯独 JS 没有。

**根因**:**Nginx 1.25 起把 `.js` 的默认 MIME 类型从 `application/javascript` 改成了 `text/javascript`**(见 `mime.types`),而配置里 `gzip_types` 只列了旧值。本机 Nginx 为 1.30.4,因此 JS 完全绕过了 gzip。

**影响**:每个首次访问的用户多传输 682 KB。本站为**按流量计费**,该问题同时推高账单和首屏耗时。

**修复**(`deploy/nginx/mayinfriday.icdiary.com.conf`):

1. `gzip_types` 同时列出 `text/javascript` 和 `application/javascript`
2. `/assets/`、`/images|files/` 由 `expires` + `add_header` 改为**单条** `add_header Cache-Control ... always` —— 原写法实测会下发**两个 `Cache-Control` 响应头**

**修复后实测**:

| 指标 | 修复前 | 修复后 |
|---|---|---|
| 主 JS 传输量 | 987,896 B | **305,247 B** |
| 压缩比 | 无 | **3.2x(省 69.1%)** |
| 首屏总量(HTML+CSS+JS) | ~995 KB | **305 KB** |
| `Cache-Control` 头 | 2 条(重复) | 1 条 |

> **给后续维护者**:新增任何 Nginx 站点配置时,`gzip_types` 务必同时包含 `text/javascript`。只写 `application/javascript` 在 Nginx ≥ 1.25 上会静默失效——不报错、不告警,只是文件变大 3 倍。

### 站点域名

**`mayinfriday.icdiary.com`** —— 主域名 `icdiary.com` 的独立子域名,不影响老服务器 `139.196.107.123` 上的 `@` / `www` / `weaving` / `waving`。Nginx 配置见 `deploy/nginx/mayinfriday.icdiary.com.conf`。

### 已确认的前置条件

- [x] **ICP 备案接入商是阿里云** —— 主域名 `icdiary.com` 已备案,子域名无需单独备案
- [x] ECS 安全组已放行公网 TCP `80`、`443`
- [x] DNS A 记录 `mayinfriday` → `8.133.195.118` 已添加

### 代码侧验证结果(2026-09-04 实测)

- 测试:2 文件 / 5 项全通过
- 构建:成功,产物 `dist/assets/index-*.js` 987.90 kB(gzip 304 kB)
- Lint:`server.js`、`server.test.js`、`api/_redis.js`、`vite.config.js` **零错误**
- 全量 lint 有 97 个 error,但**报错文件与本次改动文件交集为空**,全部是既有问题(主要是 `api/` 下 7 个未触碰的文件缺 `/* global process */`,以及 `src/` 下的 unused vars)
- 密钥检查:git 仅跟踪 `.env.example`;`sh-mayin.pem`(权限 600)、`.env.aliyun`、`.env.local` 均已被 `.gitignore` 忽略
- DNS/HTTP:`mayinfriday.icdiary.com` 已解析到 `8.133.195.118`;临时 HTTP Nginx 配置已启用,首页、`/healthz`、`/api/products`、SPA 深链接均返回 200

---

## 交接:剩余待执行步骤

以下步骤可直接执行。**按顺序进行,每步验证通过再进下一步。**

> 执行进度(2026-09-04):步骤 1–5 已完成。下一步是步骤 6 浏览器完整业务链路,随后执行步骤 7 数据初始化和收尾清单。

### 前提信息

| 项目 | 值 |
|---|---|
| 站点域名 | `mayinfriday.icdiary.com` |
| ECS 公网 IP | `8.133.195.118` |
| SSH | `root@8.133.195.118:22`,私钥 `./sh-mayin.pem`(权限 600) |
| Nginx 配置源文件 | `deploy/nginx/mayinfriday.icdiary.com.conf` |
| 应用目录 / 静态目录 | `/var/www/web-mayfriday/app` / `/var/www/web-mayfriday/dist` |

> ⚠️ **本地 DNS 检查会被代理干扰**:开发机装有 Surge/Clash 类工具,`dig mayinfriday.icdiary.com` 会返回 `198.18.x.x` 这类 fake-IP,`nc` 探测端口也会全部"成功"(代理照单全收)。**验证时必须指定公共 DNS**:
> ```bash
> dig @223.5.5.5 +short mayinfriday.icdiary.com   # 应为 8.133.195.118
> ```
> 端口连通性以**服务器上 `ss -lntp` 的结果**为准,不要信本机 `nc`。

### 步骤 1:复验 DNS 与端口

**状态:已完成。** DNS 返回 `8.133.195.118`;Nginx 监听 80,Node 仅监听 `127.0.0.1:3000`。

```bash
# 本地(务必指定公共 DNS)
dig @223.5.5.5 +short mayinfriday.icdiary.com    # 期望 8.133.195.118

# 服务器上确认监听状况
ssh -i ./sh-mayin.pem root@8.133.195.118 'ss -lntp | grep -E ":(80|443|3000)"'
# 签证书前期望:nginx 监听 0.0.0.0:80,node 只监听 127.0.0.1:3000
# 443 会在步骤 3 启用正式 HTTPS 配置后出现
```

**如果 node 监听在 `0.0.0.0:3000` 而非 `127.0.0.1:3000`,说明 `server.js` 没生效,停下排查。**

### 步骤 2:上传并启用临时 HTTP 配置

**状态:已完成。** 临时配置已安装到服务器并 reload;公网首页、API、SPA fallback 均已返回 200。

```bash
scp -i ./sh-mayin.pem \
  deploy/nginx/mayinfriday.icdiary.com.http.conf \
  root@8.133.195.118:/etc/nginx/conf.d/mayinfriday.icdiary.com.conf

ssh -i ./sh-mayin.pem root@8.133.195.118 '
  mkdir -p /var/www/html/.well-known/acme-challenge
  nginx -t && systemctl reload nginx
'
```

临时配置不引用尚未签发的证书,因此 `nginx -t` **必须成功**,不能把失败当成正常。先验证 HTTP 站点和 API:

```bash
curl -I http://mayinfriday.icdiary.com/                 # 200
curl -s http://mayinfriday.icdiary.com/api/products | head -c 200
# 第二条必须返回 JSON,不是 HTML
```

### 步骤 3:签发证书(certbot,自动续期)

前提:80 端口公网可达 + DNS 已生效 + 备案通过(三者均已满足)。

**状态:已完成。** Certbot `5.8.0` 已安装到 `/opt/certbot`;HTTP-01 验证通过,证书有效期至 2026-12-02;正式 HTTPS 配置已启用。续期 timer 为 `enabled/active`,`renew --dry-run` 已成功。

Alibaba Cloud Linux 4 默认仓库没有 `certbot` RPM。使用 Certbot 官方列出的 pip 备选方案,并隔离在 Python virtualenv 中:

```bash
ssh -i ./sh-mayin.pem root@8.133.195.118 '
  python3 -m venv /opt/certbot
  /opt/certbot/bin/pip install --upgrade pip certbot \
    --index-url https://pypi.tuna.tsinghua.edu.cn/simple
  ln -sf /opt/certbot/bin/certbot /usr/local/bin/certbot

  certbot certonly --webroot -w /var/www/html \
    -d mayinfriday.icdiary.com \
    --agree-tos --no-eff-email -m <你的邮箱>

  install -d -m 755 /etc/nginx/ssl/mayinfriday.icdiary.com
  ln -sf /etc/letsencrypt/live/mayinfriday.icdiary.com/fullchain.pem \
         /etc/nginx/ssl/mayinfriday.icdiary.com/fullchain.pem
  ln -sf /etc/letsencrypt/live/mayinfriday.icdiary.com/privkey.pem \
         /etc/nginx/ssl/mayinfriday.icdiary.com/privkey.pem

'
```

签发成功后上传正式 HTTPS 配置并启用 443:

```bash
scp -i ./sh-mayin.pem \
  deploy/nginx/mayinfriday.icdiary.com.conf \
  root@8.133.195.118:/etc/nginx/conf.d/mayinfriday.icdiary.com.conf

ssh -i ./sh-mayin.pem root@8.133.195.118 \
  'nginx -t && systemctl reload nginx'
```

最后配置仓库内提供的自动续期定时任务,不能假定系统自带 `certbot-renew.timer`:

```bash
scp -i ./sh-mayin.pem deploy/systemd/certbot-renew.{service,timer} \
  root@8.133.195.118:/etc/systemd/system/

ssh -i ./sh-mayin.pem root@8.133.195.118 '
  systemctl daemon-reload
  systemctl enable --now certbot-renew.timer
  certbot renew --dry-run --no-random-sleep-on-renew
  systemctl list-timers certbot-renew.timer --no-pager
'
```

`dry-run` 必须成功;定时器每天运行两次,仅在证书真正续期后 reload Nginx。

> 本次优先用 HTTP-01:不需要修改 DNS TXT,配置里也已放行 `/.well-known/acme-challenge/`。DNS-01 并非技术上不可用;DNS 可以同时存在多个同名 TXT 值,但本次没有使用它的必要。

### 步骤 4:公网验收

**状态:已完成。** 首页 200、`/healthz` 正常、`/api/products` 返回 JSON、SPA 深链接 200、HTTP 返回 301、证书域名和有效期均正确。

```bash
curl -I  https://mayinfriday.icdiary.com/                      # 200
curl -s  https://mayinfriday.icdiary.com/api/products | head -c 200
                                                               # 必须是 JSON
curl -I  https://mayinfriday.icdiary.com/my-courses            # 200(SPA fallback)
curl -sI http://mayinfriday.icdiary.com/ | head -1             # 301 → https
```

**第二条最关键**:若返回 `<!doctype html>` 说明 Nginx location 优先级出错,`/api/` 被 `location /` 吞掉了。

### 步骤 5:上线前安全检查

**状态:已完成。** `EXPOSE_SMS_CODE` 未启用,`.env` 权限为 600,错误管理员密码通过公网 HTTPS 返回 401、正确密码在服务器本机返回 200。

```bash
ssh -i ./sh-mayin.pem root@8.133.195.118 '
  cd /var/www/web-mayfriday/app
  node --input-type=module -e '\''
    import "dotenv/config"
    if (process.env.EXPOSE_SMS_CODE === "true") process.exit(1)
    console.log("EXPOSE_SMS_CODE safe")
  '\''
  stat -c "%a" /var/www/web-mayfriday/app/.env      # 应为 600
'

# 用错误密码验证 ADMIN_PASSWORD 已生效(代码兜底值是 admin123)
curl -s 'https://mayinfriday.icdiary.com/api/admin?action=listCodes&adminPassword=admin123'
# 期望返回 401 管理员密码错误;若返回数据说明 ADMIN_PASSWORD 没生效
```

### 步骤 6:浏览器端完整链路

见下文「验证清单」的 8 步。重点:

1. 首页 Network 面板确认**没有 `fonts.googleapis.com` 的挂起请求**
2. `/tools` 商品列表正常(验证 `shared/products.js` 回落生效)
3. 注册 → 收真实短信 → localStorage 出现 `auth-storage`
4. `/admin/codes` 创建激活码 → `/activate` 激活 → `/my-courses` 可见 → 播放视频
5. 换设备登录同一账号,原设备被踢下线

### 步骤 7:数据初始化

Redis 是全新空库,需要重建(详见第 10 节):

- 激活码:`/admin/codes` 后台创建
- 会员权益:`/admin/members` 手工恢复受影响的付费用户
- 商品目录:**自动回落**到 `shared/products.js`,除非之前在后台改过

### 收尾事项

- [ ] 确认 Redis 自动备份已开启,并做一次**恢复演练**(本次事故的根本教训)
- [ ] 把私钥 `sh-mayin.pem` 从仓库工作区移到 `~/.ssh/`(虽已被 `*.pem` 忽略,但不宜留在仓库内)
- [ ] SSH `22` 来源从 `0.0.0.0/0` 收紧到可信 IP;删除公网 `3389`(RDP)规则
  - ⚠️ 国内家宽 IP 多为动态,收紧后 IP 变更会锁死 SSH。**后路:阿里云控制台的 VNC 远程连接**永远可用
- [ ] 提交所有改动到 git(截至交接时**尚未提交**,共 22 个文件变更)

## Context

当前项目部署在 Vercel,国内用户无法访问,而主要用户在国内大陆和港台地区。同时 Vercel 上的 Redis 集成已显示 `Uninstalled`,存量业务数据(用户账号、订单、激活码)确认丢失——因为这些数据只存在于一个没有备份的免费 Redis 实例里。

本次迁移要解决两件事:**让国内用户能正常访问**,以及**让业务数据不再存在于一个没有备份的地方**。

### 已确认的前提

| 前提 | 状态 | 对方案的影响 |
|---|---|---|
| 域名 ICP 备案 | **已确认备案接入商为阿里云** | 子域名无需单独备案,可部署到当前阿里云 ECS |
| Redis 存量数据 | **确认丢失** | 不需要数据迁移;需要全新初始化 |
| 存储架构 | **保持纯 Redis** | 不引入 MySQL,改动最小化,优先上线 |
| OSS bucket | `web-mayfriday-videos` @ `oss-cn-beijing` | 保持北京;签名在 ECS 本地计算,视频由浏览器直连 OSS |

### 代码现状(已调研确认)

**迁移友好的部分** —— 这套代码对 Vercel 的耦合极浅:

- 前端 24 处 `fetch` 全部是相对路径 `/api/xxx`,无硬编码域名,无 `VITE_` 环境变量 → **前端 API 层零改动**
- 认证是 localStorage + `Authorization: Bearer`,**完全不用 Cookie** → 无 SameSite/Domain 跨域坑
- `api/` 下 11 个 handler 全是 `export default async function handler(req, res)`,只用到 `res.status()` 和 `res.json()` → Express 原生兼容
- 无 `export const config`,无 `process.env.VERCEL*`,无 Edge Runtime,无 CORS 代码
- `getProductCatalog()` (`api/_products.js:60`) 在 Redis 为空时**自动回落**到 `shared/products.js` 内置目录 → 商品数据不需要手工重建
- OSS CORS 已是 `AllowedOrigin: *` (`cors-rules-video.xml`) → **不需要改 OSS 白名单**

**必须处理的阻塞点**:

1. `api/_redis.js:14` —— `new Redis(url)` 模块级单例,**没有 `redis.on('error')` 监听**。Serverless 下崩了只影响单次请求;长驻 Express 进程下,ioredis 的 error 事件无监听会**直接 crash 整个 Node 进程**(Redis 重启、网络抖动、鉴权失败都会触发)。这是迁移中最必须修的一点。
2. `api/` 下**无任何 `dotenv` 引用**,完全依赖 Vercel 运行时注入环境变量 → 自建服务必须自己加载。
3. `req.body` 被直接解构(`login.js:15`、`register.js:15`、`send-sms-code.js:18`、`activate-course.js:15`),Express 不加 `express.json()` 会 TypeError。Vercel body 上限 4.5MB,Express 默认仅 100kb。
4. `vercel.json` 的 SPA rewrite 需要在 Nginx/Express 等价实现,**且 `/api` 必须优先于 fallback**,顺序写反会让 `/api/login` 返回 HTML。
5. `vite.config.js` 没有 `server.proxy` —— 之前本地开发靠 `vercel dev`,迁移后该命令作废,本地开发流程会断。
6. `index.html:18-20` 引用 Google Fonts,国内访问会超时并阻塞首屏渲染——直接违背本次迁移目的。

---

## 目标架构

```
                    已备案域名 (DNS → ECS 公网 IP)
                              │
                       ┌──────▼──────┐
                       │    Nginx    │  443/80, TLS, gzip, 静态直出
                       └──┬───────┬──┘
              /api/*      │       │   其他所有路径
                 ┌────────▼─┐   ┌─▼──────────────┐
                 │ Node/PM2 │   │ dist/ 静态文件  │
                 │ Express  │   │ + SPA fallback │
                 │  :3000   │   └────────────────┘
                 └────┬─────┘
                      │ 内网
         ┌────────────┼────────────┐
         ▼            ▼            ▼
   云数据库Redis      OSS        短信 PNVS
   (同VPC内网)   (仅本地签名)
```

> 注:ECS 与 OSS 之间**没有数据传输** —— `signatureUrl()` 是本地计算,视频由浏览器直连 OSS 拉取。

**全部同域**:前端和 `/api` 由同一个 Nginx 提供 → 不需要任何 CORS 代码,`api/` 里零 CORS 改动。

**区域**:**华东2(上海)**,可用区 B。

> **关于区域的一处更正**:本文档早期版本建议选华北2(北京)以「与 OSS 同区域走内网免流量费」。复查代码后该理由**不成立**——`api/get-video-url.js:37` 的 `client.signatureUrl()` 是纯本地 HMAC 计算,不发任何网络请求;视频流量是浏览器直连 OSS,不经过 ECS。因此 ECS 与 OSS 跨区域没有流量成本,上海对港台用户反而更近。
>
> 但有一条硬约束:**云数据库 Redis 必须与 ECS 同地域、同 VPC**。交换机可以不同,同 VPC 内可以通过私网互通。

---

## 基础设施选型与成本

| 项目 | 规格 | 成本(参考) |
|---|---|---|
| ECS | `ecs.e-c1m1.large` 经济型 e,2vCPU 2GiB,华东2上海 | ¥45.14/月(首购惠价 ¥19.86/月) |
| 系统盘 | ESSD Entry 40GiB | 含在实例价内 |
| 公网带宽 | **按使用流量**,峰值 50–100 Mbps | ~¥0.8/GB,约 ¥5–20/月 |
| 云数据库 Redis | 1GB 标准版双副本,**自动备份** | 约 ¥550/年(新用户更低) |
| 文件备份 | 100GiB 免费额度内 | ¥0 |
| 域名 | 已有 | 已付 |
| SSL 证书 | 阿里云免费 DV 证书 | ¥0 |
| **合计新增** | | **约 ¥1100–1400 / 年** |

**不要选突发性能实例 t6**:基准 CPU 只有 5%/10%/20%,积分耗尽后性能崩塌,不适合常驻 Web 服务;`t6-c4m1` 仅 0.5GiB 内存会让 Node 直接 OOM。

**关于 Redis 的选择**:这次数据丢失的根因就是「业务数据放在一个没有备份的实例上」。云数据库 Redis 的自动备份 + 双副本正是这个问题的直接解药,¥550/年 是买保险。若预算敏感,可在同一台 ECS 自建 Redis(开 AOF + 每日 `BGSAVE` 后 rsync 到 OSS),省这笔钱但备份可靠性由自己负责。**推荐用托管版**。

**关于带宽计费模式(重要)**:`public/` 有 93MB 静态素材(63MB 图片 + 30MB 文件),其中单个 zip 27MB、多个 PNG 达 6MB。

**必须选「按使用流量」,不要选「按固定带宽 1 Mbps」**——1 Mbps 只有 128 KB/s,单张 6MB 图片要加载 48 秒,比 Vercel 还慢,迁移就白做了。固定带宽 5M 约 ¥125/月、10M 约 ¥250/月,成本不划算;按流量则峰值带宽可拉到 50–100 Mbps,页面满速加载,只为实际传输量付费。记得在控制台设流量告警防止突增账单。

若带宽成为瓶颈,阶段二接入阿里云 CDN(源站指向 ECS,CDN 用站点域名,保持同源)。

---

## 阶段一:切流量前必须完成

目标是**一比一跑通**,不做重构。预计 1 人天。

### 1. 服务器初始化

实际环境:**Alibaba Cloud Linux 4**(dnf/yum 系),华东2上海可用区 B。

#### 1.1 购买 ECS 时的关键选项

| 配置项 | 选什么 | 说明 |
|---|---|---|
| 实例规格 | `ecs.e-c1m1.large`(2vCPU 2GiB 经济型 e) | 够用:Node ~400MB + Nginx ~50MB + 系统 ~500MB。**不要选 t6 突发性能** |
| 镜像 | Alibaba Cloud Linux 4 64位 | 免费、官方长期支持、dnf/yum 兼容 |
| 系统盘 | ESSD Entry 40GiB | 实际占用约 6–7GB,富余充足 |
| 文件备份 | **勾选激活** | 100GiB 免费额度内,每天自动备份,30 天可找回 |
| 快照策略 | **创建**,每周一次保留 7 天 | 防实例级故障 |
| 带宽计费 | **按使用流量**,峰值 50–100 Mbps | 见上文「关于带宽计费模式」 |
| 安全组 | **必须放行 22 / 80 / 443** | 控制台只提示 22,漏了 80/443 网站访问不了 |
| 登录凭证 | 密钥对(新建并下载 `.pem`) | 比密码安全,`deploy.sh` 走 SSH 免密 |
| 登录名 | `root` | `deploy.sh` 的 `DEPLOY_USER` 默认值 |

#### 1.2 购买云数据库 Redis

产品选「云数据库 Tair(兼容 Redis)」或「云数据库 Redis 版」。

| 配置项 | 选什么 | 为什么 |
|---|---|---|
| 地域/可用区 | **上海,可用区 B**(与 ECS 同区) | 跨可用区有额外延迟 |
| 网络类型 | **专有网络 VPC**,与 ECS **同 VPC** | 不同 VPC 内网不通;同 VPC 的不同交换机可以互通 |
| 版本 | Redis 7.0(或 6.0),社区版 | 够用 |
| 架构 | **标准版(双副本)**,不要集群版 | 数据量单节点绰绰有余 |
| 规格 | 1GB | 之前 30MB 都够,1GB 是最小起步 |
| 密码 | 强密码,**避免 `@ : / #`** | 这些字符在连接串里需 URL 编码,易踩坑 |

买完必须做三件事:

1. **白名单只加 ECS 的内网 IP**(不是公网 IP),删掉默认的 `0.0.0.0/0`
2. **不要申请公网连接地址**,只用内网地址
3. **进「备份恢复」确认自动备份已开启** —— 这是上次丢数据的直接教训

本实例启用了「用户名 + 密码」认证,连接串格式如下。密码若含特殊字符必须先做 URL 编码:

```
redis://r-uf6sy3sqwcvpzfh6uf:URL编码后的密码@r-uf6sy3sqwcvpzfh6uf.redis.cn-shanghai.rds.aliyuncs.com:6379/0
```

#### 1.3 服务器初始化命令

SSH 上去后逐条执行:

```bash
# ── 系统更新 ──
sudo dnf update -y

# ── 先检查 swap;本实例已有 4GiB,无需重复创建 ──
free -h

# ── Node.js(Alibaba Cloud Linux 4 仓库当前提供 Node 22 LTS) ──
sudo dnf install -y nodejs
node -v

# ── Nginx ──
sudo dnf install -y nginx
sudo systemctl enable --now nginx

# ── PM2;官方 npm 源超时时改用国内镜像 ──
sudo npm install -g pm2 --registry=https://registry.npmmirror.com
sudo pm2 startup systemd -u root --hp /root

# ── 建目录 ──
sudo mkdir -p /var/www/web-mayfriday/app /var/www/web-mayfriday/dist /var/log/pm2
```

#### 1.4 SELinux(最容易漏,漏了 Nginx 反代会 502)

Alibaba Cloud Linux 默认可能开着 SELinux,它会**阻止 Nginx 连接本机 3000 端口**。本实例检查结果为 `Disabled`,无需修改:

```bash
getenforce
```

输出 `Enforcing` 时执行:

```bash
# 允许 Nginx 发起网络连接(反代必需)
sudo setsebool -P httpd_can_network_connect 1

# 允许 Nginx 读 /var/www 下的静态文件
sudo dnf install -y policycoreutils-python-utils
sudo semanage fcontext -a -t httpd_sys_content_t "/var/www/web-mayfriday/dist(/.*)?"
sudo restorecon -Rv /var/www/web-mayfriday/dist
```

输出 `Disabled` 或 `Permissive` 则跳过。

#### 1.5 防火墙

阿里云 ECS 真正的防火墙是**安全组**,但系统内的 firewalld 也可能拦:

```bash
sudo systemctl status firewalld
# 若在运行:
sudo firewall-cmd --permanent --add-service=http --add-service=https
sudo firewall-cmd --reload
```

同时回控制台确认安全组已放行 22 / 80 / 443。

#### 1.6 域名与 DNS

**站点域名:`mayinfriday.icdiary.com`**(主域名 `icdiary.com` 已有 DNS 托管在阿里云)。

主域名下已有其他服务在跑,**新站用独立子域名,不动任何现有记录**:

| 已有记录 | 指向 | 归属 |
|---|---|---|
| `@`、`www`、`weaving`、`waving` | `139.196.107.123` | 老服务器(阿里云上海 IP 段) |
| `xhs` | `*.tcbaccess.tencentcloudbase.com` | 腾讯云开发 |
| `record` | `*.cn-hangzhou.fc.aliyuncs.com` | 阿里云函数计算(杭州) |
| `_acme-challenge` TXT | — | 已有 Let's Encrypt DNS 验证在用 |

新增一条记录即可:

| 字段 | 值 |
|---|---|
| 记录类型 | `A` |
| 主机记录 | `mayinfriday` |
| 解析线路 | 默认 |
| 记录值 | `8.133.195.118` |
| TTL | 10 分钟 |

验证:`dig +short mayinfriday.icdiary.com` → 应输出 `8.133.195.118`

> `_acme-challenge` TXT 记录已存在(老站在用)。DNS 允许多个同名 TXT 值,因此这不会让 DNS-01 在技术上不可用;但新站无需修改 DNS TXT,本次优先使用 HTTP-01(webroot),见 1.8。

#### 1.7 ICP 备案(中国内地 ECS 的硬阻塞)

上海 ECS 属于中国内地节点。**未备案的域名解析过来,阿里云会直接拦截 80/443**,网站打不开。

**上线前必须确认**:登录 [阿里云备案控制台](https://beian.aliyun.com/) 查 `icdiary.com`:

| 情况 | 处理 | 周期 |
|---|---|---|
| 在本账号下、状态正常 | ✅ 直接进行,**子域名不需要单独备案** | 0 |
| 备案接入商是别家(腾讯云等) | 需做**接入备案**到阿里云 | 约 1–3 天 |
| 查不到备案记录 | 走完整备案流程 | 约 1–3 周 |

已实际核实为第一种情况:主域名备案状态正常,接入商为阿里云。

备案状态不影响在服务器本机用 `127.0.0.1` 验证应用,但**公网验收、证书签发、DNS 切流都要等备案通过**。

#### 1.8 SSL 证书(推荐 certbot,可自动续期)

阿里云免费 DV 证书现在也只有 3 个月有效期,需要季度手工续签;certbot 能自动续期,长期省事。

Alibaba Cloud Linux 4 默认仓库没有 Certbot RPM。本机实际安装与续期命令以「交接:剩余待执行步骤」的步骤 3 为准。

**前置条件**:安全组已放行 80 → DNS 已生效 → **备案已通过**。三者已经实测满足,ACME HTTP-01 挑战路径公网返回 200。安装、签发、启用 HTTPS 和自动续期的唯一执行版本见交接步骤 3;不要再使用 `dnf install certbot`,因为 Alibaba Cloud Linux 4 默认仓库不提供该包。

> 备选:阿里云「数字证书管理服务」申请免费 DV 证书 → 下载 **Nginx 版** → 上传两个文件到 `/etc/nginx/ssl/mayinfriday.icdiary.com/`,改名为 `fullchain.pem` / `privkey.pem`,`chmod 600`。

路径需与 `deploy/nginx/mayinfriday.icdiary.com.conf` 中的 `ssl_certificate` / `ssl_certificate_key` 一致。HTTP→HTTPS 跳转已包含。

### 2. 新增 `server.js`(项目根目录)

Express 入口。**中间件顺序是最容易出错的地方**,必须严格按下面的顺序:

```js
import 'dotenv/config'          // ← 必须在最前,api/ 里没有任何 dotenv 引用
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 11 个路由 handler 显式 import —— 不要自动扫描 api/ 目录,
// 否则会把 5 个 _ 前缀共享模块也挂成路由(它们没有 default handler,会直接报错)
import login from './api/login.js'
import register from './api/register.js'
// ... 其余 9 个

const app = express()
app.disable('x-powered-by')
app.set('query parser', 'simple')   // 与 Vercel 行为对齐,避免 ?path[]=x 构造出非字符串
app.use(express.json({ limit: '2mb' }))  // Vercel 默认 4.5MB,Express 默认仅 100kb

// 薄适配层:捕获异步异常,避免单个 handler 抛错打挂长驻进程
const wrap = (h) => (req, res) => Promise.resolve(h(req, res)).catch((e) => {
  console.error(`[api] ${req.method} ${req.path}`, e)
  if (!res.headersSent) res.status(500).json({ success: false, error: 'Internal error' })
})

// ① API 路由 —— 必须在静态文件和 fallback 之前
app.get('/healthz', (req, res) => res.json({ ok: true }))
app.all('/api/login', wrap(login))
app.all('/api/register', wrap(register))
app.all('/api/logout', wrap(logout))
app.all('/api/send-sms-code', wrap(sendSmsCode))
app.all('/api/activate-course', wrap(activateCourse))
app.all('/api/check-course-access', wrap(checkCourseAccess))
app.all('/api/get-user-courses', wrap(getUserCourses))
app.all('/api/get-video-url', wrap(getVideoUrl))
app.all('/api/products', wrap(products))
app.all('/api/orders', wrap(orders))
app.all('/api/admin', wrap(admin))     // 单文件多方法,靠 action 参数分发
app.use('/api', (req, res) => res.status(404).json({ success: false, error: 'API route not found' }))

// ② 静态文件
const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(process.env.DIST_DIR || path.join(currentDirectory, 'dist'))
app.use(express.static(dist, { index: false }))

// ③ SPA fallback —— 等价于 vercel.json 的 rewrite,必须最后
app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')))

const port = Number(process.env.PORT) || 3000
app.listen(port, '127.0.0.1')          // 只允许 Nginx 从本机反代,禁止公网直连 3000
```

> 注:若 Nginx 已接管静态文件直出(推荐,见第 5 步),②③ 可保留作为兜底,不冲突。

`orders.js` 和 `admin.js` 是「单 URL 承载多动作」的写法(Vercel 每文件一函数的产物)。**保持不动**,用 `app.all` 挂载即可,这样可以随时一键回滚。不要在首次迁移就拆成 RESTful——拆了要同步改前端 12 处 fetch。

### 3. 加固 `api/_redis.js`(必改,否则进程会崩)

```js
const redisUrl = process.env.REDIS_URL
if (!redisUrl) throw new Error('REDIS_URL 未配置')  // 不再静默连 127.0.0.1:6379

const redis = new Redis(redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 200, 3000),
})
redis.on('error', (e) => console.error('[redis]', e.message))  // ← 关键:没有它进程会 crash
```

同时删掉 Vercel 集成遗留的两个变量名回退(`REDIS_URL_mayinfriday_REDIS_URL`、`mayinfriday_REDIS_URL`,当前 `_redis.js:11-13`),只保留 `REDIS_URL`。

### 4. 环境变量

在服务器创建 `.env`(权限 600),配齐 **12 个**变量。当前 `.env.example` 只列了 OSS 四项,需要补全:

```
DIST_DIR=/var/www/web-mayfriday/dist
REDIS_URL=            # 阿里云 Redis 内网地址
JWT_SECRET=           # 必须显式设置,代码里有硬编码兜底值(login.js:43)
ADMIN_PASSWORD=       # 必须显式设置,代码里兜底是 'admin123'(admin.js:9)
OSS_ACCESS_KEY_ID=
OSS_ACCESS_KEY_SECRET=
OSS_BUCKET=web-mayfriday-videos
OSS_REGION=oss-cn-beijing
SMS_ACCESS_KEY_ID=
SMS_ACCESS_KEY_SECRET=
SMS_SIGN_NAME=
SMS_TEMPLATE_CODE=
# EXPOSE_SMS_CODE 上线时必须保持未设置 —— 设为 'true' 会把验证码明文返回给前端
```

> 数据既然已经丢了,`JWT_SECRET` 无需沿用旧值,直接生成新的强随机值:
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
>
> **首次部署顺序**:必须先在服务器创建
> `/var/www/web-mayfriday/app/.env`,填完上述配置并执行
> `chmod 600 /var/www/web-mayfriday/app/.env`,然后才能运行 `deploy.sh`。
> PM2 的 `cwd` 是 `app/`,`dotenv` 会从该目录读取 `.env`;
> 缺少 `REDIS_URL` 时服务会按预期拒绝启动。

同步更新 `.env.example` 补齐全部变量名(不含值),并清理 `setup-vercel-env.sh`(内含明文占位 AccessKey,迁移后作废)。

### 5. Nginx 配置

**现成配置在 `deploy/nginx/mayinfriday.icdiary.com.conf`**,已填好真实域名和证书路径,直接上传即可:

```bash
# 本地
scp -i ~/.ssh/sh-mayin.pem \
  deploy/nginx/mayinfriday.icdiary.com.conf \
  root@8.133.195.118:/etc/nginx/conf.d/

# 服务器
nginx -t                    # 语法检查,必须 successful
systemctl reload nginx
```

(`deploy/nginx/web-mayfriday.conf.example` 是不含域名的通用模板,供将来新增站点参考。)

关键设计点:

- **`/api/` 的 location 必须优先于 `location /`** —— 顺序写反会让 API 请求被 SPA fallback 吞掉返回 HTML,前端 `res.json()` 报 `Unexpected token '<'`
- `client_max_body_size 2m` 与 `server.js` 的 `express.json({ limit: '2mb' })` 对齐
- `http2 on;` 用新语法 —— Nginx 1.25.1 起 `listen 443 ssl http2` 已废弃(本机为 1.30.4)
- `/.well-known/acme-challenge/` 放行在 80 端口的 301 跳转**之前**,否则 certbot 续期会失败
- `/assets/` 带内容 hash → `immutable` 长缓存;`/images/`、`/files/` 不带 hash → 仅 7 天

**日志脱敏(重要)**:`/api/admin` 和 `/api/orders` 目前**把管理员密码放在 URL query 里**传递(`admin.js:13`、`orders.js:73`),会被完整写进 access log。自建后日志留在自己服务器上,泄露面比 Vercel 更大。首期用 Nginx 层缓解——定义一个不记录 query string 的 log_format:

```nginx
log_format admin_safe '$remote_addr - [$time_local] "$request_method $uri" '
                      '$status $body_bytes_sent "$http_user_agent"';
```

(把密码改到请求头是阶段二的代码改造。)

### 6. PM2 配置

新增 `ecosystem.config.cjs` —— **必须用 `.cjs` 后缀**,因为 `package.json` 里是 `"type": "module"`。

```js
module.exports = {
  apps: [{
    name: 'web-mayfriday',
    script: './server.js',
    instances: 1,          // 先单进程。api/admin.js 有 KEYS 阻塞命令,
    exec_mode: 'fork',     // 多开只会放大 Redis 压力,不解决问题
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DIST_DIR: '/var/www/web-mayfriday/dist',
    },
    error_file: '/var/log/pm2/web-mayfriday-error.log',
    out_file: '/var/log/pm2/web-mayfriday-out.log',
  }]
}
```

配置 `pm2 startup` + `pm2 save`,保证服务器重启后自动拉起。

### 7. 补 `vite.config.js` 的 dev proxy

`vercel dev` 迁移后不可用,不补这个本地开发就没法调 API:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3000' },   // 本地另起 node server.js
  },
  test: { globals: true, environment: 'jsdom' },
})
```

### 8. 去掉 Google Fonts

`index.html:18-20` 的 `fonts.googleapis.com` / `fonts.gstatic.com` 在国内会超时,并且是 `<link rel="stylesheet">` —— **阻塞首屏渲染**。这直接违背迁移目的,必须在上线前处理。

最省事的做法:删掉这三行,改用系统字体栈(`PingFang SC` / `Microsoft YaHei` / `Noto Sans SC` 本地回落),在 `tailwind.config.js` 里配 `fontFamily`。若确实需要 Noto 的字形,阶段二再做子集化自托管。

### 9. 部署方式

**本地构建 + rsync 上传**,不在服务器上拉 GitHub。理由:国内 ECS 访问 GitHub 慢且不稳定,而本地已有代理配置(见 `CLAUDE.md` 的代理说明)。

新增 `deploy.sh`:
0. 确认服务器已存在 `/var/www/web-mayfriday/app/.env`且权限为 `600`
1. 本地 `npm run build`
2. `rsync -avz --delete dist/ 服务器:/var/www/web-mayfriday/dist/`(排除 `.DS_Store`——当前 `dist/` 里有一个会被打包进去)
3. `rsync` 上传 `api/`、`shared/`、`server.js`、`package.json`、`package-lock.json`、`ecosystem.config.cjs`
4. 服务器上通过国内 npm 镜像执行 `npm ci --omit=dev` + `pm2 reload web-mayfriday`

本实例使用 PEM 密钥部署:

```bash
DEPLOY_HOST=8.133.195.118 DEPLOY_KEY_PATH=./sh-mayin.pem ./deploy.sh
```

注意 `.gitignore` 已排除的 `content/`(4.8GB 本地素材源)**不参与部署**,不要 rsync。

`vercel.json` 暂时保留,用于 DNS 切换失败时回滚到 Vercel。
它不会被 Node、PM2 或 Nginx 读取,不影响阿里云部署。

### 10. 数据初始化

因为 Redis 是全新空库:

| 数据 | 处理方式 |
|---|---|
| 商品目录 | **自动回落**,`_products.js:60` 在 Redis 为空时读 `shared/products.js` 内置目录。若之前在后台改过商品,需要在 `/admin/products` 重新录入 |
| 激活码 | 必须重新生成。可复用 `scripts/create-test-code.js` 的写法(它已用 `import 'dotenv/config'` + `set()`),或直接用 `/admin/codes` 后台创建 |
| 用户账号 | 无法恢复,存量用户需重新注册。**建议提前通知用户** |
| 订单历史 | 无法恢复 |
| 会员权益 | 需在 `/admin/members` 手工重新授予给受影响的付费用户 |

> **上线前先在测试环境跑一遍完整链路**:发验证码 → 注册 → 激活课程 → 看视频。

### 11. 上线与验收

本次用**独立子域名** `mayinfriday.icdiary.com`,不触碰主域名现有解析,因此**没有传统意义上的「切流量」风险** —— 新旧站可以长期并存,验证满意后再决定是否把主域名也指过来。

上线顺序(每步都要通过才能进下一步):

1. **确认备案通过**(1.7)—— 否则后面全部会失败
2. **安全组放行 80 / 443**,删掉 3389 RDP 规则
3. **添加 DNS A 记录** `mayinfriday` → `8.133.195.118`(1.6),`dig` 验证生效
4. **上传 Nginx 配置**(第 5 节),`nginx -t` 通过后 reload
5. **签发证书**(1.8),再次 `nginx -t` + reload
6. **跑验证清单**(见下节)——服务端 5 条 + 浏览器端 8 步
7. **数据初始化**(第 10 节)——创建激活码、恢复付费用户会员权益

公网验收命令:

```bash
curl -I  https://mayinfriday.icdiary.com/                    # 200,index.html
curl -s  https://mayinfriday.icdiary.com/api/products | head -c 200
                                                             # JSON,不是 <!doctype html>
curl -I  https://mayinfriday.icdiary.com/my-courses          # 200,SPA fallback 生效
curl -I  http://mayinfriday.icdiary.com/                     # 301 → https
```

第二条最关键:返回 HTML 说明 Nginx location 优先级出了问题。

**回滚**:Vercel 部署保留不删。新子域名出问题时,老站(`@` / `www` / `weaving`)完全不受影响,直接停用新子域名的 DNS 记录即可,对现有用户零影响。

---

## 阶段二:上线后优化

按优先级排列。这些都是**既有问题**,不是迁移引入的,但自建环境下值得逐步处理。

### 安全

1. **HLS 课程视频是公共读** —— `VideoPlayer.jsx:26` 注释明确写了「HLS 文件已设为公共读取」。这意味着**任何人拿到 m3u8 URL 就能免费看付费课程**,而 URL 硬编码在前端 JS 里(`src/data/courses/*.js`、`src/data/resources.js`)。这是当前最严重的业务漏洞。修法:把 HLS 也改成私有读,让 `/api/get-video-url` 签名整个播放链路(需要处理 ts 分片的签名,建议配合 CDN 鉴权)。
2. **`/api/get-video-url` 无鉴权** —— 已确认全文无 Authorization 校验,任何人可对任意 OSS 对象签名 24 小时 URL。修法:抽一个 `api/_auth.js` 共享模块,把 `check-course-access.js:27-82` 的「取 token → JWT verify → Redis `token:{jwt}` 校验 → deviceId 比对 → 取 user」这段复用出来,`get-video-url.js` 和其余 3 个需要鉴权的接口一起改用它。同时对 `path` 参数加前缀白名单。前端 `VideoPlayer.jsx:92` 需补上 `Authorization` 头(目前没带)。
3. **管理员密码从 URL query 移到请求头** —— 改 `api/admin.js:13`、`api/orders.js:73` 读 `req.headers['x-admin-password']`,前端 4 个 Admin 页面共 12 处 fetch 同步改。改完后可撤掉 Nginx 的日志脱敏 hack。
4. **`/admin/*` 前端路由无守卫** —— 4 个后台路由不像 `/my-courses` 那样包 `ProtectedRoute`。可在 Nginx 对 `/admin` 加 IP 白名单或 HTTP Basic 二次保护。
5. **激活码「查重→标记已用」非原子** —— `activate-course.js:56` 读、`:135` 写,并发下同一码理论上可被用两次。用 Lua 脚本或 `SET NX` 修掉。

### 性能

6. **`admin.js` 的 `KEYS` 换 `SCAN`** —— `admin.js:20`(`keys('code:*')`)和 `:102`(`keys('user:*')`)是 O(N) 阻塞命令。Serverless 下感受不明显,长驻单进程下一旦慢查询会**拖住全站所有请求**。数据量涨起来前必须改。
7. **JS 分包** —— `dist/assets/index-*.js` 单包 988KB 未分割。在 `vite.config.js` 加 `build.rollupOptions.output.manualChunks`,拆出 react/react-dom、react-router、swiper、hls.js+react-player。
8. **图片压缩** —— `public/images/` 63MB 未经压缩,单个 PNG 达 6MB(如 `courses/course2/第11页-1.png`)。转 WebP 可省 60%+ 带宽。
9. **接入阿里云 CDN** —— 源站指向 ECS,用站点域名保持同源。带宽压力大时再上。

### 可靠性

10. **确认 Redis 自动备份已开启并验证可恢复** —— 这次事故的根本教训。买了托管 Redis 不等于安全,要实际做一次恢复演练。
11. **OSS client 复用** —— `get-video-url.js:28` 每次请求都 `new OSS(...)`,长驻进程下可提到模块级复用。

---

## 验证清单

上线前在服务器上逐项确认:

```bash
# 1. 服务起来了
curl http://127.0.0.1:3000/healthz          # → {"ok":true}

# 2. API 走通了(不是返回 HTML —— 这是中间件顺序错误的典型症状)
curl https://<域名>/api/products             # → JSON,不是 <!doctype html>

# 3. SPA 深链接不 404
curl -I https://<域名>/my-courses            # → 200 且返回 index.html

# 4. Redis 连通
# 服务器上:redis-cli -u $REDIS_URL ping     # → PONG

# 5. 进程不会因 Redis 抖动而崩
# 临时把 Redis 白名单去掉,观察 pm2 logs 是否只报错不退出,恢复后能自愈
```

浏览器端完整链路:

1. 首页加载,**打开 DevTools Network 确认没有 `fonts.googleapis.com` 的挂起请求**
2. `/tools` 商品列表正常显示(验证 `shared/products.js` 回落生效)
3. 注册:输入手机号 → 收到真实短信 → 完成注册 → localStorage 里有 `auth-storage`
4. 后台 `/admin/codes` 创建一个激活码
5. `/activate` 用该激活码激活课程
6. `/my-courses` 显示已激活课程
7. 进入课程播放视频(HLS 走公共读,MP4 走 `/api/get-video-url`)
8. 换一台设备登录同一账号,确认原设备被踢下线(验证 `token:*` 单设备逻辑)

---

## 风险与回滚

| 风险 | 缓解 |
|---|---|
| 中间件顺序写反,`/api/*` 返回 HTML | 验证清单第 2 项专门覆盖 |
| Redis 抖动导致 Node 进程反复 crash | 阶段一第 3 步的 `error` 监听是必改项;PM2 兜底自动重启 |
| 环境变量漏配,静默走硬编码兜底值 | `JWT_SECRET` / `ADMIN_PASSWORD` 上线后立即用错误密码验证一次后台拒绝访问 |
| 单机无冗余,服务器宕机即全站不可用 | 首期接受(与当前 Vercel 免费版可用性相当);阶段二可加 CDN + 快照备份 |
| 存量用户投诉数据丢失 | **上线前主动通知**,并准备好在 `/admin/members` 手工恢复付费用户权益 |

**回滚**:Vercel 部署保留不删。若阿里云侧出问题,DNS 切回 Vercel 即可恢复海外访问(国内仍不可访问,但至少不是全挂)。由于数据已经全丢,不存在「两边数据不一致」的回滚难题。

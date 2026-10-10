# 域名迁移:mayinfriday.icdiary.com → mayinfriday.com

新域名备案已完成（2026-10）。目标是把主站切到 `mayinfriday.com`，旧域名整站
301 跳转过去，老用户的深链接不失效。

服务器:`8.133.195.118`，密钥 `./sh-mayin.pem`，站点根 `/var/www/web-mayfriday`。

---

## 0. 先理解三件事

**登录态会丢。** `src/store/authStore.js` 用 zustand `persist` 存 localStorage，
按 origin 隔离。老用户 301 过来后是未登录状态，必须重新登录一次。课程权限按
手机号存在服务端，重新登录后原样都在。新域名上有一条说明横幅
（`src/components/common/DomainNoticeBanner.jsx`）。

**旧域名的证书不能停。** TLS 握手发生在 HTTP 301 之前。旧域名证书一旦过期，
老用户看到的是浏览器安全警告，而不是跳转。所以旧域名的 DNS 记录、证书、
以及 80 端口上的 `/.well-known/acme-challenge/` 都要继续维护，**切换后不要
立刻下掉**。建议至少保留 12 个月。

**`log_format` 和 `limit_req_zone` 在 http 上下文只能定义一次。** 原先它们写在
`mayinfriday.icdiary.com.conf` 里。扩到多域名后已抽到 `00-shared.conf`，站点
配置只引用不定义。如果新旧配置同时带着定义，`nginx -t` 会报 duplicate 并拒绝
reload —— 所以第 3 步的三个文件必须**一起**上传再 reload。

---

## 1. DNS 与备案

阿里云 DNS 控制台，给 `mayinfriday.com` 加两条 A 记录：

| 主机记录 | 类型 | 记录值 |
|---|---|---|
| `@` | A | `8.133.195.118` |
| `www` | A | `8.133.195.118` |

同时确认：

- 备案接入商是阿里云，且备案绑定的就是这台 ECS 的公网 IP。接入商不对的话
  80 端口会被阻断，证书签不下来。
- 旧域名 `mayinfriday.icdiary.com` 的 A 记录**保持不动**。

等 DNS 生效（通常几分钟到半小时）后验证：

```bash
dig +short mayinfriday.com
dig +short www.mayinfriday.com
# 两条都应返回 8.133.195.118
```

---

## 2. 签发新证书

先放一个最小的 HTTP 配置，只为 ACME 验证开路。它刻意不引用
`admin_safe` / `limit_req_zone`，可以和服务器上现有的旧配置共存。

```bash
scp -i ./sh-mayin.pem \
  deploy/nginx/mayinfriday.com.http.conf \
  root@8.133.195.118:/etc/nginx/conf.d/mayinfriday.com.conf

ssh -i ./sh-mayin.pem root@8.133.195.118 'nginx -t && systemctl reload nginx'
```

验证 ACME 路径可达（应返回 404 而不是连接失败或超时）：

```bash
curl -I http://mayinfriday.com/.well-known/acme-challenge/probe
```

签证书，两个域名签在同一张证书上（`-d` 的第一个域名决定 `live/` 目录名）：

```bash
ssh -i ./sh-mayin.pem root@8.133.195.118 '
  certbot certonly --webroot -w /var/www/html \
    -d mayinfriday.com -d www.mayinfriday.com \
    --agree-tos --no-eff-email -m <你的邮箱>

  install -d -m 755 /etc/nginx/ssl/mayinfriday.com
  ln -sf /etc/letsencrypt/live/mayinfriday.com/fullchain.pem \
         /etc/nginx/ssl/mayinfriday.com/fullchain.pem
  ln -sf /etc/letsencrypt/live/mayinfriday.com/privkey.pem \
         /etc/nginx/ssl/mayinfriday.com/privkey.pem
'
```

用软链不用拷贝：certbot 续期只更新 `/etc/letsencrypt/live/`，拷贝会在三个月后
悄悄变成过期证书。续期 timer 已经在跑（`certbot-renew.timer`），新证书会自动
被纳入，不需要额外配置。

---

## 3. 切换（原子操作）

三个文件必须一起上传再 reload，否则中间态会有重复定义：

```bash
scp -i ./sh-mayin.pem \
  deploy/nginx/00-shared.conf \
  root@8.133.195.118:/etc/nginx/conf.d/00-shared.conf

scp -i ./sh-mayin.pem \
  deploy/nginx/mayinfriday.com.conf \
  root@8.133.195.118:/etc/nginx/conf.d/mayinfriday.com.conf

scp -i ./sh-mayin.pem \
  deploy/nginx/mayinfriday.icdiary.com.conf \
  root@8.133.195.118:/etc/nginx/conf.d/mayinfriday.icdiary.com.conf

ssh -i ./sh-mayin.pem root@8.133.195.118 'nginx -t && systemctl reload nginx'
```

`nginx -t` 必须通过才会 reload。失败时服务器上仍跑着旧配置，站点不受影响，
按报错修完再来一次。

---

## 4. 部署带提示横幅的前端

横幅是前端代码，要重新构建部署才会出现：

```bash
DEPLOY_HOST=8.133.195.118 DEPLOY_KEY_PATH=./sh-mayin.pem ./deploy.sh
```

---

## 5. 验收

```bash
# 新域名主站
curl -I https://mayinfriday.com/
curl -s https://mayinfriday.com/healthz

# www 跳裸域名
curl -I https://www.mayinfriday.com/
# 期望 301 → https://mayinfriday.com/

# 旧域名跳新域名，且保留路径
curl -I https://mayinfriday.icdiary.com/courses/course3
# 期望 301 → https://mayinfriday.com/courses/course3

# 旧域名明文也跳
curl -I http://mayinfriday.icdiary.com/

# 证书覆盖两个域名
echo | openssl s_client -connect mayinfriday.com:443 -servername mayinfriday.com 2>/dev/null \
  | openssl x509 -noout -dates -ext subjectAltName
```

浏览器侧还要确认：

- 首页、课程页、`/courses/course3` 深链接都正常
- 视频能播（HLS 走 `/api/hls-playlist`，同源，不受域名影响）
- 提示横幅出现，点关闭后刷新不再出现
- 重新登录后横幅消失，已购课程都在

---

## 6. 容易被忘掉的收尾

- **OSS 防盗链**：如果 `web-mayfriday-videos` bucket 配了 Referer 白名单，
  要把 `mayinfriday.com` 和 `www.mayinfriday.com` 加进去，否则视频和图片 403。
  仓库里只有公读策略（`deploy/oss/resources-public-read-policy.json`），没有
  Referer 配置，需要到阿里云控制台确认一次。
- **短信签名**：阿里云短信如果在模板或签名里写了旧网址，要同步改。
- **淘宝店铺 / 课程卡片 / 说明书**上印的网址，换成新域名。
- **搜索引擎**：301 会自动转移权重，不用额外操作。想加速可以在站长平台提交
  改版规则。
- **旧域名回收**：至少保留 12 个月。真要下线时，先确认访问日志里旧域名的
  流量已经接近 0。

---

## 回滚

切换只动 nginx 配置，回滚很快：

```bash
ssh -i ./sh-mayin.pem root@8.133.195.118 '
  rm -f /etc/nginx/conf.d/mayinfriday.com.conf /etc/nginx/conf.d/00-shared.conf
'
# 再把 git 里上一个版本的 mayinfriday.icdiary.com.conf 传回去
git show HEAD:deploy/nginx/mayinfriday.icdiary.com.conf > /tmp/icdiary-rollback.conf
scp -i ./sh-mayin.pem /tmp/icdiary-rollback.conf \
  root@8.133.195.118:/etc/nginx/conf.d/mayinfriday.icdiary.com.conf
ssh -i ./sh-mayin.pem root@8.133.195.118 'nginx -t && systemctl reload nginx'
```

注意浏览器会缓存 301。回滚后已经跳过的用户在缓存过期前仍会被带到新域名，
这是 301 的固有代价 —— 如果对切换还没把握，可以先把两个 `return 301` 改成
`return 302` 跑几天，确认无误再改回 301。

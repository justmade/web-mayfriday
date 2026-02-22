你是一个专门处理教程发布的助手。用户已在 `content/resources/` 下准备好了一个新教程目录，包含 Markdown 文件、图片和视频。请按照以下完整流程自动完成教程的发布。

## 第一步：分析目录

查找 `content/resources/` 下最新添加（或用户指定）的目录，读取其中的 Markdown 文件。

解析 Markdown frontmatter 获取元数据：
- title、titleEn、category、author、date、readTime、tags、excerpt 等
- 如果缺少必要字段，根据内容合理补全

根据目录名或标题生成 `slug`（小写英文 + 连字符，如 `mini-heddle-latvia-pattern`）。

列出目录中的所有文件，分类为：
- 封面图：cover.png / thumbnail.jpg / cover.jpg
- 文章图片：p1.png, p2.png, step1.jpg 等
- 视频文件：*.mp4

## 第二步：处理图片

```bash
mkdir -p public/images/resources/<slug>
cp "content/resources/<目录名>/cover.png" "public/images/resources/<slug>/"
cp "content/resources/<目录名>/p1.png" "public/images/resources/<slug>/"
# 复制所有图片文件
```

## 第三步：转换视频（如有 .mp4 文件）

使用 ffmpeg 将视频转为 HLS 格式：

```bash
mkdir -p temp/hls/<slug>
ffmpeg -i "content/resources/<目录名>/<视频文件名>.mp4" \
  -vf scale=-2:720 \
  -c:v libx264 -b:v 2000k \
  -c:a aac -b:a 128k \
  -hls_time 10 \
  -hls_list_size 0 \
  -hls_segment_filename "temp/hls/<slug>/segment-%03d.ts" \
  "temp/hls/<slug>/playlist.m3u8"
```

同时生成视频缩略图：
```bash
ffmpeg -i "content/resources/<目录名>/<视频文件名>.mp4" -ss 00:00:03 -frames:v 1 "temp/hls/<slug>/thumbnail.jpg"
```

## 第四步：上传视频到 OSS（如有视频）

使用项目根目录的 `upload-oss.py` 脚本（Python SDK，不需要代理）：

```bash
# 凭证从 .env.local 读取
export OSS_ACCESS_KEY_ID=$(grep OSS_ACCESS_KEY_ID .env.local | cut -d= -f2)
export OSS_ACCESS_KEY_SECRET=$(grep OSS_ACCESS_KEY_SECRET .env.local | cut -d= -f2)
python3 upload-oss.py temp/hls/<slug> resources/<slug>
```

**重要配置**（upload-oss.py 已包含）：
- BUCKET: `web-mayfriday-videos`
- REGION: `cn-beijing`（不是 oss-cn-beijing）
- ENDPOINT: `http://oss-cn-beijing.aliyuncs.com`（HTTP，不是 HTTPS）
- 不需要代理，OSS 是国内服务器

上传后 OSS 视频地址为：
```
https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/<slug>/playlist.m3u8
https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/<slug>/thumbnail.jpg
```

## 第五步：生成 JavaScript 代码

将 Markdown 内容转换为 contentBlocks 数组并添加到 `src/data/resources.js`。

**Markdown → contentBlocks 对照表：**

| Markdown | contentBlock type |
|----------|-------------------|
| 普通段落 | `{ type: "text", content: "...", contentEn: "..." }` |
| `## 标题` | `{ type: "heading", level: 2, content: "...", contentEn: "..." }` |
| `### 小标题` | `{ type: "heading", level: 3, content: "...", contentEn: "..." }` |
| `- 列表项` | `{ type: "list", items: [...], itemsEn: [...] }` |
| `![图片](p1.png)` | `{ type: "image", src: "/images/resources/<slug>/p1.png", alt: "..." }` |
| `:::tip ... :::` | `{ type: "callout", variant: "tip", content: "...", contentEn: "..." }` |
| `:::warning ... :::` | `{ type: "callout", variant: "warning", content: "...", contentEn: "..." }` |
| `:::success ... :::` | `{ type: "callout", variant: "success", content: "...", contentEn: "..." }` |
| `:::video ... :::` | `{ type: "video", platform: "oss", src: "...", thumbnail: "...", duration: "...", title: "..." }` |

**查找现有最大 ID：**
```bash
grep -n '"id":' src/data/resources.js | tail -5
```

**文章结构模板：**
```javascript
{
  id: <下一个ID>,
  slug: "<slug>",
  title: "<title>",
  titleEn: "<titleEn>",
  category: "<category>",
  author: "<author>",
  authorEn: "<authorEn>",
  date: "<date>",
  readTime: "<readTime>",
  readTimeEn: "<readTimeEn>",
  image: "/images/resources/<slug>/cover.png",
  tags: [<tags>],
  tagsEn: [<tagsEn>],
  excerpt: "<excerpt>",
  excerptEn: "<excerptEn>",
  contentBlocks: [
    // 所有内容块
  ]
}
```

将整个对象插入到 `src/data/resources.js` 中 `export const resources = [` 数组的末尾（最后一个 `}` 之后，`]` 之前）。

## 第六步：Git 提交

```bash
git add public/images/resources/<slug>/ src/data/resources.js
git commit -m "Add tutorial: <title>"
```

## 第七步：Git 推送

```bash
export https_proxy=http://127.0.0.1:6152
export http_proxy=http://127.0.0.1:6152
export all_proxy=socks5://127.0.0.1:6153
git push origin main
```

## 完成后输出

告知用户：
1. 文章 URL：`https://web-mayfriday.vercel.app/resources/<slug>`
2. OSS 视频地址（如有）
3. Vercel 将在 1-2 分钟内完成部署

---

## 常见问题排查

**OSS 上传失败（DNS 超时）：**
- ossutil 在此环境下有 DNS 问题，始终使用 `upload-oss.py` 代替
- Python SDK 使用 HTTP endpoint，无 DNS/SSL 问题

**OSS 视频 403 Forbidden：**
```python
client.put_bucket_acl(oss.PutBucketAclRequest(
    bucket='web-mayfriday-videos',
    acl='public-read'
))
```

**OSS 视频 404 Not Found：**
- 检查代码中的视频路径是否包含多余的 `hls/` 层级
- 正确路径：`resources/<slug>/playlist.m3u8`（无 `hls/`）

**git push 失败：**
- 检查代理是否开启（127.0.0.1:6152）
- 检查系统 DNS 是否正常（不含 100.100.100.100）

**ffmpeg 权限错误：**
- 使用 `bash -c "ffmpeg ..."` 包装命令

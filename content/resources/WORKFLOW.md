# 教程发布完整工作流

## 概述

本项目使用 Markdown 驱动的内容管理工作流。您只需在指定目录准备好内容文件，运行 `/new-tutorial` 即可自动完成从内容转换到线上发布的全部步骤。

---

## 一、准备内容

### 1. 创建目录

在 `content/resources/` 下创建新目录，目录名建议用英文（会影响 URL slug）：

```
content/resources/
└── my-article-name/        ← 新建这个目录
    ├── article.md           ← 文章内容（必须）
    ├── cover.png            ← 封面图片（必须）
    ├── p1.png               ← 文章图片（可选）
    ├── p2.png
    └── tutorial.mp4         ← 视频文件（可选，可很大）
```

### 2. 编写 Markdown 文件

参考 `TEMPLATE.md` 模板，文章结构如下：

```markdown
---
title: 【分类】文章标题 - 副标题
titleEn: [Category] Article Title - Subtitle
category: tutorial
author: 五月的星期五
authorEn: MayFriday
date: 2026-02-22
readTime: 20分钟
readTimeEn: 20 min read
thumbnail: cover.png
tags: 编织, 提花, 教程
tagsEn: weaving, pattern, tutorial
excerpt: 2-3句摘要，显示在列表页。
excerptEn: 2-3 sentence summary for listing page.
---

文章正文内容...

## 章节标题

段落内容，支持**粗体**和*斜体*。

- 列表项一
- 列表项二

:::tip
💡 小技巧提示框
:::

### 步骤一

详细说明...

![步骤示意图](p1.png "图片说明")

### 步骤二

:::video
src: tutorial.mp4
platform: oss
thumbnail: cover.png
duration: 10:30
title: 视频标题
titleEn: Video Title
:::

:::warning
⚠️ 注意事项
:::
```

---

## 二、发布教程

准备好目录后，在 Claude Code 中运行：

```
/new-tutorial
```

Claude 会自动执行以下所有步骤：

| 步骤 | 内容 | 说明 |
|------|------|------|
| 1 | 分析目录 | 读取 Markdown，解析元数据和内容结构 |
| 2 | 处理图片 | 复制图片到 `public/images/resources/<slug>/` |
| 3 | 转换视频 | ffmpeg 转换为 HLS 格式（720p）|
| 4 | 上传视频 | Python SDK 上传到阿里云 OSS |
| 5 | 生成代码 | Markdown → JavaScript contentBlocks |
| 6 | 提交代码 | git add + git commit |
| 7 | 推送部署 | git push → Vercel 自动部署 |

部署完成后（约 1-2 分钟），文章即可在以下地址访问：
```
https://web-mayfriday.vercel.app/resources/<slug>
```

---

## 三、技术架构

### 文件路径规范

```
公开图片:  public/images/resources/<slug>/
临时视频:  temp/hls/<slug>/           ← 转换后 HLS 文件（可删除）
OSS 视频:  resources/<slug>/          ← 上传到 OSS 的路径
代码数据:  src/data/resources.js      ← 文章 JavaScript 数据
```

### OSS 配置

- **Bucket**: `web-mayfriday-videos`
- **Region**: `cn-beijing`
- **Endpoint**: `http://oss-cn-beijing.aliyuncs.com`（HTTP）
- **上传工具**: `upload-oss.py`（Python SDK，无需代理）
- **访问权限**: public-read

> ⚠️ 不要使用 ossutil 上传，存在 DNS 解析问题。始终使用 `upload-oss.py`。

### 视频转换参数

```bash
ffmpeg -i input.mp4 \
  -vf scale=-2:720 \        # 720p，保持宽高比
  -c:v libx264 -b:v 2000k \ # H.264，2Mbps
  -c:a aac -b:a 128k \      # AAC 音频
  -hls_time 10 \             # 每段 10 秒
  -hls_list_size 0 \         # 保留所有分段
  -hls_segment_filename "segment-%03d.ts" \
  playlist.m3u8
```

### 网络配置

- **git push / Vercel 部署**：需要代理 `http://127.0.0.1:6152`
- **OSS 上传**：不需要代理（国内服务器）
- **npm install**：需要代理

---

## 四、常见问题

### OSS 上传失败
- 检查 `OSS_ACCESS_KEY_ID` 和 `OSS_ACCESS_KEY_SECRET` 环境变量
- 确认使用 `upload-oss.py` 而非 ossutil
- 确认 endpoint 使用 HTTP 而非 HTTPS

### 视频播放 403
```python
# 设置 bucket 为公共读
client.put_bucket_acl(oss.PutBucketAclRequest(
    bucket='web-mayfriday-videos',
    acl='public-read'
))
```

### 视频播放 404
- 检查 `src/data/resources.js` 中的视频 URL
- 正确：`resources/<slug>/playlist.m3u8`
- 错误：`resources/<slug>/hls/playlist.m3u8`（多余的 `hls/`）

### git push 超时
- 确认代理已开启（Surge/ClashX 等）
- 检查系统 DNS 不含 `100.100.100.100`

---

## 五、目录结构总览

```
web-mayfriday/
├── content/resources/          # 原始内容（Markdown + 图片 + 视频）
│   ├── TEMPLATE.md             # 文章模板
│   ├── WORKFLOW.md             # 本文档
│   └── <article-name>/        # 每篇文章的目录
├── public/images/resources/    # 处理后的图片（部署到 CDN）
│   └── <slug>/
├── src/data/resources.js       # 所有文章数据
├── temp/hls/                   # 临时 HLS 文件（上传后可删除）
├── upload-oss.py               # OSS 上传工具
└── .claude/commands/
    └── new-tutorial.md         # /new-tutorial skill 定义
```

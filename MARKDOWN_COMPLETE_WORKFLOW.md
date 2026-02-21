# 📝 Markdown 文章完整工作流程 / Complete Markdown Workflow

## 🎯 完整流程概览

### **您的工作：**
1. ✅ 用 Markdown 写文章
2. ✅ 将图片和视频文件放在文章文件夹中
3. ✅ 在 Markdown 中标记图片和视频位置
4. ✅ 告诉我"文章准备好了"

### **我的工作：**
1. ✅ 读取和解析 Markdown 文件
2. ✅ **复制图片到网站目录**
3. ✅ **处理视频（转 HLS 格式）**
4. ✅ **上传视频到阿里云 OSS**
5. ✅ 生成网页代码
6. ✅ 提交并部署
7. ✅ 告诉您访问链接

---

## 📁 文件组织结构

### 您的文章文件夹

```
content/resources/leopard-pouch/
├── article.md                 # ✅ Markdown 文章
├── thumbnail.jpg              # ✅ 缩略图（必需）
├── step1.jpg                  # ✅ 文章内图片
├── step2.jpg                  # ✅ 文章内图片
├── step3.jpg                  # ✅ 文章内图片
├── tutorial-video.mp4         # ✅ 原始视频文件
└── video-thumbnail.jpg        # ✅ 视频封面图

（或者）
├── tutorial-video.mov         # 支持 MP4/MOV/AVI 等格式
```

**重要说明：**
- 📸 **图片**：放 JPG/PNG 格式，我会复制到正确位置
- 🎬 **视频**：放原始视频文件（MP4/MOV/AVI），我会处理并上传 OSS

---

## 🖼️ 图片处理流程（我来做）

### 1. 我会做什么

**自动处理步骤：**
```
您的文件夹:
content/resources/leopard-pouch/step1.jpg

↓ 我复制到 ↓

网站目录:
public/images/resources/leopard-pouch/step1.jpg

↓ 生成访问路径 ↓

网页代码:
src: "/images/resources/leopard-pouch/step1.jpg"
```

### 2. 您只需要

在 Markdown 中这样写：
```markdown
![步骤一示意图](step1.jpg "图片说明")
```

**我会自动：**
- ✅ 复制 `step1.jpg` 到 `public/images/resources/文章slug/`
- ✅ 生成正确的访问路径
- ✅ 添加到网页代码中
- ✅ 提交到 Git

### 3. 图片优化建议

**推荐规格：**
- 缩略图：800x450 像素（16:9）
- 文章内图片：800-1200px 宽度
- 格式：JPG（照片）或 PNG（图表/截图）
- 大小：每张 < 300KB（推荐压缩）

**压缩工具：**
- 在线：https://tinypng.com/
- Mac：ImageOptim
- 命令行：我可以帮您批量压缩

---

## 🎬 视频处理流程（我来做）

### 1. 视频格式转换

**您提供原始视频：**
```
tutorial-video.mp4  (500MB, 1920x1080, 20分钟)
```

**我会转换为 HLS 格式：**
```
HLS 是一种流媒体格式，优点：
✅ 自动适应网速
✅ 支持多码率切换
✅ 更好的用户体验
✅ 减少加载时间

转换后的文件结构：
tutorial-video/
├── playlist.m3u8        # 主播放列表
├── segment-0.ts         # 视频片段 1
├── segment-1.ts         # 视频片段 2
├── segment-2.ts         # 视频片段 3
└── ...                  # 更多片段
```

**转换参数（我会用）：**
- 分辨率：720p (1280x720)
- 码率：2000kbps
- 切片长度：10秒/片
- 编码：H.264 + AAC

**转换命令示例：**
```bash
ffmpeg -i tutorial-video.mp4 \
  -vf scale=-2:720 \
  -c:v libx264 -b:v 2000k \
  -c:a aac -b:a 128k \
  -hls_time 10 \
  -hls_list_size 0 \
  -hls_segment_filename "segment-%03d.ts" \
  playlist.m3u8
```

### 2. 上传到阿里云 OSS

**我会自动：**
1. ✅ 转换视频为 HLS 格式
2. ✅ 创建 OSS 文件夹结构
3. ✅ 批量上传所有视频片段
4. ✅ 上传播放列表文件
5. ✅ 上传视频缩略图
6. ✅ 设置正确的访问权限
7. ✅ 生成播放 URL

**OSS 目录结构：**
```
OSS Bucket: web-mayfriday-videos
└── resources/
    └── leopard-pouch/              # 文章 slug
        ├── hls/
        │   ├── playlist.m3u8       # HLS 播放列表
        │   ├── segment-000.ts      # 视频片段
        │   ├── segment-001.ts
        │   └── ...
        └── thumbnail.jpg           # 视频封面
```

**生成的播放 URL：**
```
https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/leopard-pouch/hls/playlist.m3u8
```

### 3. 您只需要

在 Markdown 中这样写：
```markdown
:::video
src: tutorial-video.mp4
thumbnail: video-thumbnail.jpg
duration: 19:10
title: 豹纹笔袋完整教程
titleEn: Leopard Pouch Complete Tutorial
:::
```

**我会自动：**
- ✅ 检测到视频文件 `tutorial-video.mp4`
- ✅ 转换为 HLS 格式
- ✅ 上传到 OSS
- ✅ 获取播放 URL
- ✅ 更新 Markdown 中的 `src` 为 OSS URL
- ✅ 上传缩略图到 OSS
- ✅ 生成网页代码

---

## 🔧 技术细节（自动化脚本）

### 我会使用的工具

**1. 图片处理**
- 简单文件复制：`cp` 命令
- 可选压缩：ImageMagick 或 TinyPNG API

**2. 视频转换**
- FFmpeg：视频格式转换和切片
- 自动检测视频信息（分辨率、时长等）

**3. OSS 上传**
- ossutil：阿里云官方命令行工具
- 批量上传多个文件
- 自动设置 MIME 类型

### 自动化脚本流程

```bash
#!/bin/bash
# 我执行的完整流程

ARTICLE_FOLDER="content/resources/leopard-pouch"
ARTICLE_SLUG="leopard-pouch"

# 1. 解析 Markdown
echo "解析 article.md..."
# 提取元数据和内容块

# 2. 处理图片
echo "复制图片到网站目录..."
mkdir -p "public/images/resources/$ARTICLE_SLUG"
cp "$ARTICLE_FOLDER"/*.jpg "public/images/resources/$ARTICLE_SLUG/"
cp "$ARTICLE_FOLDER"/*.png "public/images/resources/$ARTICLE_SLUG/"

# 3. 处理视频（如果有）
if [ -f "$ARTICLE_FOLDER/tutorial-video.mp4" ]; then
  echo "转换视频为 HLS..."

  # 创建临时目录
  mkdir -p "temp/hls/$ARTICLE_SLUG"

  # FFmpeg 转换
  ffmpeg -i "$ARTICLE_FOLDER/tutorial-video.mp4" \
    -vf scale=-2:720 \
    -c:v libx264 -b:v 2000k \
    -c:a aac -b:a 128k \
    -hls_time 10 \
    -hls_list_size 0 \
    -hls_segment_filename "temp/hls/$ARTICLE_SLUG/segment-%03d.ts" \
    "temp/hls/$ARTICLE_SLUG/playlist.m3u8"

  echo "上传到阿里云 OSS..."

  # 上传 HLS 文件
  ossutil cp -r "temp/hls/$ARTICLE_SLUG" \
    "oss://web-mayfriday-videos/resources/$ARTICLE_SLUG/hls/"

  # 上传缩略图
  ossutil cp "$ARTICLE_FOLDER/video-thumbnail.jpg" \
    "oss://web-mayfriday-videos/resources/$ARTICLE_SLUG/thumbnail.jpg"

  # 清理临时文件
  rm -rf "temp/hls/$ARTICLE_SLUG"

  echo "✅ 视频处理完成"
  echo "播放 URL: https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/$ARTICLE_SLUG/hls/playlist.m3u8"
fi

# 4. 生成网页代码
echo "生成 JavaScript 代码..."
# 将 Markdown 转换为 contentBlocks 数组

# 5. 提交到 Git
git add public/images/resources/$ARTICLE_SLUG
git add src/data/resources.js
git commit -m "Add article: $ARTICLE_SLUG"
git push origin main

echo "✅ 全部完成！"
```

---

## 📋 完整使用示例

### 第一步：准备文章

**创建文件夹：**
```bash
mkdir -p content/resources/beginner-scarf
cd content/resources/beginner-scarf
```

**文件清单：**
```
content/resources/beginner-scarf/
├── article.md              # Markdown 文章
├── thumbnail.jpg           # 缩略图 (800x450)
├── materials.jpg           # 材料展示图
├── step1.jpg               # 步骤1
├── step2.jpg               # 步骤2
├── step3.jpg               # 步骤3
├── tutorial.mp4            # 完整教程视频 (500MB, 20分钟)
└── video-thumb.jpg         # 视频封面
```

### 第二步：编写 Markdown

**article.md 内容：**
```markdown
---
title: 【新手教程】你的第一条围巾 - 从零开始
titleEn: [Beginner] Your First Scarf - From Scratch
category: tutorial
author: 张老师
authorEn: Teacher Zhang
date: 2026-02-21
readTime: 15分钟
readTimeEn: 15 min read
thumbnail: thumbnail.jpg
tags: 新手, 围巾, 基础教程
tagsEn: beginner, scarf, basic
excerpt: 零基础围巾编织教程，手把手教你完成第一条围巾...
excerptEn: Beginner-friendly scarf knitting tutorial...
---

欢迎来到编织的世界！

## 准备材料

以下是您需要的材料：

![材料清单](materials.jpg)

- 8号竹编织针一对
- 中等粗细毛线200克
- 剪刀

## 步骤一：起针

详细说明...

![起针步骤](step1.jpg "保持松紧适中")

## 步骤二：编织

详细说明...

![编织过程](step2.jpg)

## 完整视频教程

以下视频包含完整的编织演示：

:::video
src: tutorial.mp4
thumbnail: video-thumb.jpg
duration: 19:30
title: 围巾编织完整教程
titleEn: Complete Scarf Tutorial
:::

## 步骤三：收针

详细说明...

![收针步骤](step3.jpg)

:::success
✅ 恭喜完成！
:::
```

### 第三步：告诉我

**只需说：**
> "beginner-scarf 文章准备好了"

或

> "帮我发布 beginner-scarf"

### 第四步：我的处理（自动）

```
[1/7] 读取 Markdown 文件...
✅ 解析成功：beginner-scarf

[2/7] 处理图片...
✅ 复制 thumbnail.jpg → public/images/resources/beginner-scarf/
✅ 复制 materials.jpg → public/images/resources/beginner-scarf/
✅ 复制 step1.jpg → public/images/resources/beginner-scarf/
✅ 复制 step2.jpg → public/images/resources/beginner-scarf/
✅ 复制 step3.jpg → public/images/resources/beginner-scarf/

[3/7] 检测到视频文件...
📹 文件：tutorial.mp4 (485MB)
⏱️  时长：19:30
📐 分辨率：1920x1080

[4/7] 转换视频为 HLS...
⚙️  转码为 720p, 2000kbps...
✂️  切片为 10秒/段...
✅ 生成 117 个片段 (总大小: 180MB)

[5/7] 上传到阿里云 OSS...
📤 上传 playlist.m3u8...
📤 上传 117 个视频片段...
📤 上传 video-thumb.jpg...
✅ 全部上传完成

[6/7] 生成网页代码...
✅ 添加到 src/data/resources.js

[7/7] 提交并部署...
✅ Git commit 成功
✅ 推送到 GitHub
✅ Vercel 开始部署...

🎉 全部完成！

📱 访问链接：
https://web-mayfriday.vercel.app/resources/beginner-scarf

🎬 视频播放 URL：
https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/beginner-scarf/hls/playlist.m3u8
```

---

## 💡 视频处理优化

### 自动压缩和优化

**原始视频：**
- 文件：tutorial.mp4
- 大小：485MB
- 分辨率：1920x1080
- 时长：19:30

**处理后（HLS）：**
- 总大小：~180MB（减少 63%）
- 分辨率：1280x720（更适合在线观看）
- 格式：HLS（更好的流媒体体验）
- 片段：117个（每个10秒）

### 多码率支持（可选）

如果需要，我可以生成多个质量版本：
- 1080p - 高清版（3000kbps）
- 720p - 标清版（2000kbps）
- 480p - 流畅版（1000kbps）

用户根据网速自动切换。

---

## 🚀 快速参考

### Markdown 中的视频标记

**方式 1：本地视频文件（推荐）**
```markdown
:::video
src: tutorial.mp4
thumbnail: video-thumb.jpg
duration: 19:30
title: 教程标题
titleEn: Tutorial Title
:::
```
→ 我会自动转换并上传到 OSS

**方式 2：已有的 OSS URL**
```markdown
:::video
src: https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/xxx/hls/playlist.m3u8
platform: oss
thumbnail: https://...thumbnail.jpg
duration: 19:30
title: 教程标题
titleEn: Tutorial Title
:::
```
→ 我会直接使用这个 URL

**方式 3：Bilibili/YouTube**
```markdown
:::video
src: https://player.bilibili.com/player.html?bvid=BV1xx411c7mD
platform: bilibili
thumbnail: bilibili-thumb.jpg
duration: 20:00
title: B站视频
titleEn: Bilibili Video
:::
```

---

## ⚙️ 环境配置需求

### 我需要的工具（服务器端）

**1. FFmpeg（视频处理）**
```bash
# Mac
brew install ffmpeg

# Linux
apt-get install ffmpeg
```

**2. ossutil（OSS 上传）**
```bash
# 下载
wget http://gosspublic.alicdn.com/ossutil/1.7.15/ossutil64

# 配置
./ossutil64 config
# 输入 AccessKeyId
# 输入 AccessKeySecret
# 输入 Endpoint: oss-cn-beijing.aliyuncs.com
```

**3. 阿里云 OSS 配置**
- Bucket: web-mayfriday-videos
- 区域: 华北2（北京）
- 权限: 公共读
- CDN 加速: 已开启

---

## 📊 成本估算

### 视频存储和流量成本

**示例：10 个教程视频**

**存储成本：**
- 每个视频：~200MB（HLS 压缩后）
- 10个视频：2GB
- 月成本：2GB × ¥0.12/GB = ¥0.24/月

**流量成本：**
- 假设每月 500 次观看
- 每次观看 200MB = 100GB/月
- 月成本：100GB × ¥0.24/GB = ¥24/月

**总计：约 ¥25/月**

**优化建议：**
- ✅ 使用 720p（已是最优）
- ✅ HLS 切片（减少重复加载）
- ✅ CDN 加速（提高速度，降低成本）

---

## ✅ 优势总结

**完整的自动化工作流：**

| 步骤 | 您的工作 | 我的工作 |
|------|----------|----------|
| 写文章 | ✍️ Markdown | - |
| 准备图片 | 📸 放文件夹 | ✅ 复制到网站 |
| 准备视频 | 🎬 放文件夹 | ✅ 转换 HLS |
| | | ✅ 上传 OSS |
| | | ✅ 生成播放 URL |
| 生成代码 | - | ✅ 自动生成 |
| 部署上线 | 💬 告诉我 | ✅ 提交部署 |

**您只需：**
1. 写 Markdown
2. 放图片和视频
3. 说"准备好了"

**我负责一切技术细节！** 🚀

---

## 🎯 下一步

准备好开始了吗？

**选项 1：现在测试**
```bash
mkdir content/resources/test-article
cd content/resources/test-article
# 创建 article.md
# 添加几张图片
# 告诉我："test-article 准备好了"
```

**选项 2：查看完整示例**
- 查看 TEMPLATE.md
- 复制模板开始写作

**选项 3：问我问题**
- 视频需要什么格式？→ MP4/MOV/AVI 都可以
- 视频多大合适？→ < 1GB，我会压缩
- 需要自己转 HLS 吗？→ 不需要，我来做
- OSS 怎么配置？→ 我帮您配置

**告诉我您的选择！** 😊

---

**创建日期**: 2026-02-21
**版本**: 2.0（完整版）
**包含**: 图片自动复制 + 视频自动转换上传

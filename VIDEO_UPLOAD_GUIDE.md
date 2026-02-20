# 📹 视频上传完整指南

## 🎯 快速开始（3种上传方式）

### 方式 1️⃣：上传单个视频（推荐新手）

```bash
./upload-video.sh <视频路径> <文章ID> <文件名>
```

**示例：**
```bash
# 上传围巾教程第一步
./upload-video.sh ~/Downloads/scarf-step1.mp4 3 step1-cast-on.mp4

# 上传视频缩略图
./upload-video.sh ~/Downloads/thumbnail.jpg 3 thumbnail-step1.jpg
```

脚本会自动：
- ✅ 上传到正确的 OSS 路径
- ✅ 显示完整 URL
- ✅ 生成可复制的代码块

---

### 方式 2️⃣：批量上传整个文件夹（推荐多视频）

```bash
./upload-folder.sh <文件夹路径> <文章ID>
```

**示例：**
```bash
# 将 article-3 文件夹中的所有视频和图片上传到文章3
./upload-folder.sh ~/Videos/article-3/ 3
```

**文件夹组织建议：**
```
~/Videos/article-3/
├── step1-cast-on.mp4          # 第一步视频
├── step2-knit.mp4             # 第二步视频
├── step3-bind-off.mp4         # 第三步视频
├── thumbnail-step1.jpg        # 缩略图1
├── thumbnail-step2.jpg        # 缩略图2
└── thumbnail-step3.jpg        # 缩略图3
```

---

### 方式 3️⃣：使用 OSS Browser 图形界面（推荐非技术用户）

1. **下载 OSS Browser**
   - 访问: https://www.alibabacloud.com/help/zh/oss/developer-reference/ossbrowser
   - 下载适合您系统的版本（Mac/Windows/Linux）

2. **登录**
   - AccessKeyId: `YOUR_ALIBABA_CLOUD_ACCESS_KEY_ID`
   - AccessKeySecret: `YOUR_ALIBABA_CLOUD_ACCESS_KEY_SECRET`
   - 区域: 北京 (cn-beijing)

3. **上传文件**
   - 打开 bucket: `web-mayfriday-videos`
   - 导航到 `resources/` 文件夹
   - 创建文章ID文件夹（如 `3/`）
   - 拖拽视频文件到文件夹中
   - 等待上传完成

---

## 🎬 视频压缩指南（重要！节省80%成本）

### 为什么要压缩？

原始录制的视频通常非常大：
- 📹 30分钟 1080p 原始视频 = **2-4GB**
- 💰 存储费用 = 每GB ¥0.12/月
- 📡 流量费用 = 每GB ¥0.24（每次观看）

压缩后：
- 📹 30分钟 720p 压缩视频 = **300-500MB**（减少85%！）
- 💰 成本降低 80-85%
- 🚀 用户加载更快

### 推荐设置

**最佳平衡参数：**
- 分辨率: **720p (1280x720)** - 编织教程足够清晰
- 码率: **2-3 Mbps**
- 编码: **H.264 (x264)**
- 音频: **AAC 128 kbps**
- 格式: **MP4**

### 使用 HandBrake 压缩（免费，简单）

**步骤：**

1️⃣ **下载 HandBrake**
   - 访问: https://handbrake.fr/
   - 下载 Mac/Windows 版本
   - 安装（完全免费，无广告）

2️⃣ **打开视频**
   - 启动 HandBrake
   - 点击 "Open Source"
   - 选择您的视频文件

3️⃣ **选择预设**
   - 右侧预设列表
   - 选择: **"Fast 720p30"**
   - （这是最适合教程视频的预设）

4️⃣ **微调设置（可选）**
   - 切换到 "Video" 标签
   - Quality (RF): **23** (默认值，平衡质量和大小)
   - Framerate: **30 fps**

5️⃣ **选择保存位置**
   - 点击底部 "Browse"
   - 选择保存文件夹
   - 文件名: `video-compressed.mp4`

6️⃣ **开始编码**
   - 点击顶部 "Start Encode"
   - 等待完成（30分钟视频约需5-10分钟）

**压缩效果示例：**
```
原始视频: 3.2GB (30分钟, 1080p)
压缩后:   420MB (30分钟, 720p)
节省:     87%
```

---

### 使用 FFmpeg 压缩（命令行，批量处理）

**安装 FFmpeg:**
```bash
# macOS
brew install ffmpeg

# 或从官网下载: https://ffmpeg.org/download.html
```

**压缩单个视频：**
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -crf 23 \
  -preset medium \
  -vf scale=-2:720 \
  -c:a aac \
  -b:a 128k \
  output-compressed.mp4
```

**批量压缩文件夹中所有视频：**
```bash
for file in *.mp4; do
  ffmpeg -i "$file" \
    -c:v libx264 -crf 23 -preset medium \
    -vf scale=-2:720 \
    -c:a aac -b:a 128k \
    "compressed-$file"
done
```

**生成视频缩略图：**
```bash
# 提取第1秒的画面作为缩略图
ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 thumbnail.jpg

# 批量生成所有视频的缩略图
for file in *.mp4; do
  ffmpeg -i "$file" -ss 00:00:01 -vframes 1 "thumbnail-${file%.mp4}.jpg"
done
```

---

## 📝 上传后更新数据文件

上传视频后，需要在代码中添加视频块。

**编辑文件:** `src/data/resources.js`

**找到对应的文章（如文章3），在 `contentBlocks` 数组中添加：**

```javascript
{
  id: 3,
  title: "【教程】从零开始编织围巾",
  // ... 其他字段 ...

  contentBlocks: [
    {
      type: "text",
      content: "编织围巾是学习编织的最佳入门项目...",
      contentEn: "Knitting a scarf is the perfect beginner project..."
    },
    {
      type: "heading",
      level: 2,
      content: "第一步：起针",
      contentEn: "Step 1: Casting On"
    },
    // 👇 添加视频块
    {
      type: "video",
      platform: "oss",
      src: "https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/3/step1-cast-on.mp4",
      thumbnail: "https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/3/thumbnail-step1.jpg",
      duration: "8:45",  // 视频实际时长
      title: "第一步：起针完整演示",
      titleEn: "Step 1: Casting On - Full Demo"
    },
    {
      type: "text",
      content: "看完视频后，让我们来详细讲解...",
      contentEn: "After watching the video, let's explain in detail..."
    }
  ]
}
```

**提交代码：**
```bash
git add src/data/resources.js
git commit -m "Add video content to resource article #3"
git push
```

Vercel 会自动部署，几分钟后视频就能在网站上播放了！

---

## 🧪 测试视频播放

**访问文章详情页：**
```
https://your-domain.vercel.app/resources/3
```

**检查项目：**
- [ ] 视频缩略图显示
- [ ] 点击播放按钮
- [ ] 视频开始播放
- [ ] 控制条正常（播放/暂停/音量/全屏）
- [ ] 时长标签显示正确

**浏览器控制台测试 API：**
```javascript
// 打开浏览器开发者工具 (F12)
// 在 Console 中运行：
fetch('/api/get-video-url?path=resources/3/step1-cast-on.mp4')
  .then(r => r.json())
  .then(data => {
    console.log('✅ API 正常，签名 URL:', data.url)
    console.log('⏰ 有效期:', data.expiresIn, '秒 (24小时)')
  })
  .catch(err => console.error('❌ API 错误:', err))
```

---

## 📊 OSS 文件管理

### 查看已上传的文件

```bash
# 查看所有资源文件
./ossutil ls oss://web-mayfriday-videos/resources/ --config-file .ossutilconfig

# 查看特定文章的文件
./ossutil ls oss://web-mayfriday-videos/resources/3/ --config-file .ossutilconfig
```

### 删除文件

```bash
# 删除单个文件
./ossutil rm oss://web-mayfriday-videos/resources/3/old-video.mp4 --config-file .ossutilconfig

# 删除整个文件夹（谨慎！）
./ossutil rm oss://web-mayfriday-videos/resources/3/ -r --config-file .ossutilconfig
```

### 下载文件

```bash
# 下载单个文件
./ossutil cp oss://web-mayfriday-videos/resources/3/video.mp4 ./local-backup/ --config-file .ossutilconfig

# 下载整个文件夹
./ossutil cp oss://web-mayfriday-videos/resources/3/ ./local-backup/ -r --config-file .ossutilconfig
```

---

## 💡 最佳实践

### 文件命名规范

**视频文件：**
- ✅ 使用英文和连字符: `step1-cast-on.mp4`
- ✅ 描述性名称: `intro-knitting-basics.mp4`
- ❌ 避免中文: `起针.mp4`（可能有编码问题）
- ❌ 避免空格: `step 1.mp4`（需要URL编码）

**缩略图文件：**
- ✅ `thumbnail-step1.jpg`
- ✅ `cover.jpg`
- ✅ `preview-intro.jpg`

### 文件夹组织

```
oss://web-mayfriday-videos/
├── resources/
│   ├── 1/                          # 文章1
│   │   ├── intro.mp4
│   │   └── thumbnail.jpg
│   ├── 3/                          # 文章3 - 围巾教程
│   │   ├── step1-cast-on.mp4
│   │   ├── step2-knit.mp4
│   │   ├── step3-bind-off.mp4
│   │   ├── thumbnail-step1.jpg
│   │   ├── thumbnail-step2.jpg
│   │   └── thumbnail-step3.jpg
│   └── 5/                          # 文章5
│       └── ...
```

### 视频时长建议

- **简短演示:** 2-5分钟（如单个步骤）
- **完整教程:** 10-20分钟（如一个小作品）
- **深度课程:** 20-40分钟（如复杂技法）
- **避免:** 超过1小时的视频（建议拆分成多个部分）

---

## 🔒 安全注意事项

**✅ 已做：**
- AccessKey 已在 `.gitignore` 中排除
- 环境变量已在 Vercel 配置
- 视频使用私有 bucket + 签名 URL

**⚠️ 注意：**
- 不要在前端代码中硬编码 AccessKey
- 不要提交 `.env.local` 到 Git
- 定期轮换 AccessKey（建议每3个月）

---

## 📞 常见问题

### Q1: 上传速度很慢怎么办？

**答：**
- 检查网络连接
- 确认代理设置正确（`.ossutilconfig` 中的 `proxyHost`）
- 尝试使用 OSS Browser 图形工具
- 考虑先压缩视频减小文件大小

### Q2: 上传后视频无法播放？

**答：**
1. 检查文件是否成功上传：
   ```bash
   ./ossutil ls oss://web-mayfriday-videos/resources/3/ --config-file .ossutilconfig
   ```
2. 检查 URL 是否正确（复制到浏览器测试）
3. 检查浏览器控制台是否有 CORS 错误
4. 确认 Vercel 环境变量已配置

### Q3: 成本会很高吗？

**答：**
**示例计算（10个教程视频）：**
- 每个视频压缩后 400MB
- 总存储: 4GB
- 每月观看100次

**费用：**
- 存储: 4GB × ¥0.12 = **¥0.48/月**
- 流量: 40GB × ¥0.24 = **¥9.6/月**
- **总计: 约 ¥10/月**

**新用户免费额度:**
- 40GB 存储 + 流量（6个月）
- 前6个月完全免费！

### Q4: 如何获取视频时长？

**答：**
```bash
# 使用 FFmpeg 查看视频信息
ffmpeg -i video.mp4 2>&1 | grep Duration

# 或使用 ffprobe
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.mp4
```

在 Mac 上也可以：
- 右键视频 → "Get Info"
- 在 QuickTime Player 中打开查看时长

---

## 🎯 完整工作流程总结

1️⃣ **准备视频**
   - 录制/编辑视频
   - 使用 HandBrake 压缩为 720p
   - 生成缩略图

2️⃣ **上传到 OSS**
   ```bash
   ./upload-video.sh ~/Videos/tutorial.mp4 3 step1.mp4
   ./upload-video.sh ~/Videos/thumbnail.jpg 3 thumbnail-step1.jpg
   ```

3️⃣ **更新代码**
   - 编辑 `src/data/resources.js`
   - 添加视频块（复制脚本输出的代码）
   - 填写正确的视频时长

4️⃣ **提交部署**
   ```bash
   git add src/data/resources.js
   git commit -m "Add video to article #3"
   git push
   ```

5️⃣ **测试**
   - 等待 Vercel 部署完成
   - 访问文章页面
   - 测试视频播放

**完成！** 🎉

---

需要帮助？随时告诉我！ 🚀

# 🎯 视频功能部署 - 下一步操作指南

## ✅ 已完成的工作

1. **代码实现** - 所有视频支持代码已完成
   - ✅ Serverless API (`/api/get-video-url.js`) - 生成签名URL
   - ✅ VideoPlayer 组件 - 支持 OSS/YouTube/Bilibili
   - ✅ ContentRenderer 组件 - 渲染多媒体内容块
   - ✅ ResourceDetail 页面 - 文章详情页
   - ✅ 数据结构升级 - contentBlocks 支持图文视频

2. **OSS 配置** - 阿里云存储已配置
   - ✅ Bucket: `web-mayfriday-videos` (北京区域)
   - ✅ CORS 规则已设置
   - ✅ ossutil CLI 工具已配置
   - ✅ 测试文件上传成功

3. **代码已推送** - GitHub 仓库最新
   - ✅ Commit: `b708133` "Add private OSS video support"
   - ✅ 所有敏感信息已排除 (.env.local, .ossutilconfig)

---

## 🔧 待完成：配置 Vercel 环境变量

### 方法 1：网页界面（推荐）⭐

**访问链接：**
```
https://vercel.com/dashboard
→ 选择项目 "web-mayfriday"
→ Settings → Environment Variables
```

**添加这 4 个变量：**

| Name | Value | Environments |
|------|-------|--------------|
| `OSS_ACCESS_KEY_ID` | `YOUR_ALIBABA_CLOUD_ACCESS_KEY_ID` | Production, Preview, Development |
| `OSS_ACCESS_KEY_SECRET` | `YOUR_ALIBABA_CLOUD_ACCESS_KEY_SECRET` | Production, Preview, Development |
| `OSS_BUCKET` | `web-mayfriday-videos` | Production, Preview, Development |
| `OSS_REGION` | `oss-cn-beijing` | Production, Preview, Development |

**配置完成后，重新部署：**
1. 进入 Deployments 页面
2. 找到最新部署，点击 **⋯** → **Redeploy**

### 方法 2：CLI 命令（可选）

如果 Vercel CLI 登录成功，可以运行：
```bash
./setup-vercel-env.sh
```

---

## 🧪 测试视频功能

部署完成后，访问任意资源详情页测试：

**测试链接：**
```
https://your-domain.vercel.app/resources/3
```

**检查项目：**
- [ ] 页面能正常加载
- [ ] 视频播放器显示缩略图
- [ ] 点击播放后视频开始播放
- [ ] 浏览器控制台没有错误
- [ ] API `/api/get-video-url` 返回签名 URL

**调试方法：**
```javascript
// 浏览器控制台测试 API
fetch('/api/get-video-url?path=resources/3/step1.mp4')
  .then(r => r.json())
  .then(console.log)
```

---

## 📹 上传视频文件到 OSS

### 准备视频

**压缩视频（节省成本）：**
使用 HandBrake 压缩为 720p：
1. 下载 HandBrake: https://handbrake.fr/
2. 打开视频，选择预设 "Fast 720p30"
3. 开始编码（20分钟视频 → 约300-500MB）

**生成缩略图：**
```bash
ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 thumbnail.jpg
```

### 上传到 OSS

**方法 1：ossutil CLI**
```bash
# 上传单个视频
./ossutil cp video.mp4 oss://web-mayfriday-videos/resources/3/step1.mp4

# 批量上传文件夹
./ossutil cp -r ./my-videos/ oss://web-mayfriday-videos/resources/3/
```

**方法 2：OSS Browser 图形工具**
1. 下载: https://www.alibabacloud.com/help/zh/oss/developer-reference/ossbrowser
2. 使用 AccessKey 登录
3. 拖拽文件上传

### 更新数据文件

上传后，编辑 `src/data/resources.js`，添加视频块：
```javascript
{
  type: "video",
  platform: "oss",
  src: "https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/3/step1.mp4",
  thumbnail: "https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/3/thumbnail.jpg",
  duration: "8:45",
  title: "步骤演示",
  titleEn: "Step Demo"
}
```

提交并推送：
```bash
git add src/data/resources.js
git commit -m "Add video content to resource article"
git push
```

---

## 📊 成本估算

**阿里云 OSS 费用：**
- 存储: ¥0.12/GB/月（10GB ≈ ¥1.2/月）
- 流量: ¥0.24/GB（100次观看/月 ≈ ¥72）
- 新用户免费额度: 40GB存储 + 流量（6个月）

**优化建议：**
- 压缩视频可节省 80% 成本
- 开启 CDN 加速提升播放速度
- 设置费用告警避免超支

---

## 🔒 安全检查清单

- [x] `.env.local` 已添加到 `.gitignore`
- [x] `.ossutilconfig` 已添加到 `.gitignore`
- [x] GitHub 推送无敏感信息泄露
- [ ] Vercel 环境变量配置完成
- [ ] 视频播放测试通过
- [ ] 定期轮换 AccessKey（建议每3个月）

---

## 📞 遇到问题？

**常见问题：**

1. **视频无法播放** → 检查 Vercel 环境变量是否配置正确
2. **API 返回 500 错误** → 检查 AccessKey 是否有效
3. **CORS 错误** → 确认 OSS CORS 规则已设置
4. **加载很慢** → 考虑开启 OSS CDN 加速

**下一步需要帮助？**
- 配置 Vercel 环境变量时遇到问题
- 上传视频到 OSS 需要指导
- 测试视频播放功能
- 其他任何问题

随时告诉我，我会继续协助！ 🚀

# 📝 资源文章内容管理指南 / Resource Content Management Guide

## 📍 文章内容存储位置

所有文章内容都存储在一个 JavaScript 文件中：

```
src/data/resources.js
```

**这是一个纯代码文件**，不需要数据库，直接编辑即可。

---

## 🏗️ 文章结构说明

每篇文章包含两部分：

### 1. 基本信息（元数据）

```javascript
{
  id: 1,                    // 文章 ID（唯一）
  slug: "article-url-slug", // URL 路径（英文，用横杠分隔）
  title: "文章标题",        // 中文标题
  titleEn: "Article Title", // 英文标题
  category: "tutorial",     // 分类（tutorial/guide/tips/inspiration）
  author: "作者名",         // 中文作者名
  authorEn: "Author Name",  // 英文作者名
  date: "2026-02-18",       // 发布日期
  readTime: "20分钟",       // 中文阅读时间
  readTimeEn: "20 min read",// 英文阅读时间
  image: "/images/resources/article.jpg", // 缩略图路径
  excerpt: "文章摘要...",   // 中文摘要（资源列表显示）
  excerptEn: "Excerpt...",  // 英文摘要
  tags: ["标签1", "标签2"], // 中文标签
  tagsEn: ["tag1", "tag2"], // 英文标签

  contentBlocks: [ /* 文章内容 */ ]
}
```

### 2. 文章内容（contentBlocks 数组）

文章内容由多个"内容块"组成，支持 **6 种类型**：

---

## 📦 支持的内容块类型

### 1️⃣ 文本段落（text）

普通文本段落。

**用法：**
```javascript
{
  type: "text",
  content: "这是一段中文文本内容。可以是介绍、说明、描述等。",
  contentEn: "This is English text content. Can be introduction, explanation, description, etc."
}
```

**显示效果：**
普通段落，16px 字号，灰色字体。

---

### 2️⃣ 标题（heading）

段落标题，用于分隔章节。

**用法：**
```javascript
{
  type: "heading",
  level: 2,  // 标题级别：2 = 大标题, 3 = 小标题
  content: "准备材料",
  contentEn: "Materials Needed"
}
```

**可用级别：**
- `level: 2` → 大标题（24px，粗体）
- `level: 3` → 小标题（20px，粗体）

---

### 3️⃣ 列表（list）

有序或无序列表。

**无序列表（带圆点）：**
```javascript
{
  type: "list",
  ordered: false,  // 无序列表
  items: [
    {
      content: "钩针：2.5mm或3.0mm",
      contentEn: "Crochet hook: 2.5mm or 3.0mm"
    },
    {
      content: "棉线约50克",
      contentEn: "Cotton yarn ~50g"
    }
  ]
}
```

**有序列表（带数字）：**
```javascript
{
  type: "list",
  ordered: true,  // 有序列表
  items: [
    {
      content: "第一步：起针",
      contentEn: "Step 1: Cast on"
    },
    {
      content: "第二步：编织",
      contentEn: "Step 2: Knit"
    }
  ]
}
```

---

### 4️⃣ 图片（image）

插入图片，支持标题和说明文字。

**用法：**
```javascript
{
  type: "image",
  src: "/images/resources/step-1.jpg",  // 图片路径
  alt: "第一步示意图",                  // 替代文字（SEO）
  altEn: "Step 1 illustration",
  caption: "从环形起针开始",            // 图片说明（可选）
  captionEn: "Start with magic ring"
}
```

**图片路径：**
- 本地图片：`/images/resources/xxx.jpg`
- 外部图片：`https://example.com/image.jpg`
- 阿里云 OSS：`https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/xxx.jpg`

---

### 5️⃣ 视频（video）

嵌入视频播放器，支持多平台。

**阿里云 OSS 视频（推荐）：**
```javascript
{
  type: "video",
  platform: "oss",  // 阿里云 OSS
  src: "https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/1/hls/playlist.m3u8",
  thumbnail: "https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/1/thumbnail.jpg",
  duration: "19:10",  // 视频时长
  title: "豹纹笔袋完整教程",
  titleEn: "Leopard Pouch Complete Tutorial"
}
```

**Bilibili 视频：**
```javascript
{
  type: "video",
  platform: "bilibili",
  src: "https://player.bilibili.com/player.html?bvid=BV1xx411c7mD",
  thumbnail: "/images/resources/video-thumb.jpg",
  duration: "15:30",
  title: "编织教程",
  titleEn: "Knitting Tutorial"
}
```

**YouTube 视频：**
```javascript
{
  type: "video",
  platform: "youtube",
  src: "https://www.youtube.com/watch?v=VIDEO_ID",
  thumbnail: "/images/resources/video-thumb.jpg",
  duration: "20:00",
  title: "Tutorial",
  titleEn: "Tutorial"
}
```

---

### 6️⃣ 提示框（callout）

醒目的提示信息框，支持 4 种样式。

**样式类型：**
- `info` - 蓝色信息框 ℹ️
- `tip` - 绿色技巧框 💡
- `warning` - 黄色警告框 ⚠️
- `success` - 绿色成功框 ✅

**用法：**
```javascript
{
  type: "callout",
  style: "tip",  // info / tip / warning / success
  content: "💡 豹纹花样的关键在于配色的随机性。",
  contentEn: "💡 The key to leopard pattern is randomness."
}
```

**显示效果：**
- 带背景色的卡片
- 左侧有彩色边框
- 自动添加图标（可在文字中加 emoji）

---

## ✏️ 如何添加新文章

### 方法 1：复制现有文章模板

**步骤：**

1. **打开文件**
   ```bash
   open src/data/resources.js
   # 或用代码编辑器打开
   ```

2. **复制一篇现有文章**
   - 找到 `export const articles = [` 数组
   - 复制最后一篇文章的完整内容
   - 粘贴到数组末尾（注意逗号）

3. **修改基本信息**
   ```javascript
   {
     id: 9,  // ⚠️ 改为新 ID（递增）
     slug: "new-article-slug",  // ⚠️ 改为新的 URL（唯一）
     title: "新文章标题",
     titleEn: "New Article Title",
     // ... 修改其他字段
   ```

4. **编写内容块**
   ```javascript
   contentBlocks: [
     {
       type: "text",
       content: "文章开头段落...",
       contentEn: "Article intro..."
     },
     {
       type: "heading",
       level: 2,
       content: "第一章节",
       contentEn: "Chapter 1"
     },
     // 继续添加更多内容块...
   ]
   ```

5. **保存并提交**
   ```bash
   git add src/data/resources.js
   git commit -m "Add new article: 文章标题"
   git push origin main
   ```

---

### 方法 2：让我帮您生成模板

如果您要添加新文章，可以告诉我：

**提供以下信息：**
1. **文章标题**（中英文）
2. **分类**（教程/指南/技巧/灵感）
3. **简介**（2-3 句话）
4. **大致内容结构**（几个章节，包含什么内容）

**我会帮您：**
- 生成完整的文章模板代码
- 包含所有必要的字段
- 符合现有格式规范
- 您只需填入具体内容即可

---

## 🔧 如何修改现有文章

### 修改文字内容

1. 打开 `src/data/resources.js`
2. 找到要修改的文章（通过 `id` 或 `slug` 查找）
3. 修改对应的 `content` 或 `contentEn` 字段
4. 保存并提交

**示例：修改豹纹笔袋文章的摘要**
```javascript
// 找到 id: 1 的文章
excerpt: "原来的摘要...",  // ← 修改这里
excerptEn: "Original excerpt...",  // ← 修改这里
```

### 添加新的内容块

在 `contentBlocks` 数组中添加：
```javascript
contentBlocks: [
  // 现有内容块...

  // 添加新的内容块
  {
    type: "text",
    content: "新增的段落内容",
    contentEn: "New paragraph content"
  },
  {
    type: "heading",
    level: 2,
    content: "新章节",
    contentEn: "New Section"
  }
]
```

### 修改缩略图

```javascript
image: "/images/resources/new-thumbnail.jpg",  // 改为新图片路径
```

---

## 📁 文件组织建议

### 图片文件命名

```
public/images/resources/
├── leopard-pouch.jpg          (文章缩略图)
├── leopard-pouch-step1.jpg    (文章内图片 - 步骤1)
├── leopard-pouch-step2.jpg    (文章内图片 - 步骤2)
├── color-guide.jpg            (另一篇文章缩略图)
└── ...
```

**命名规范：**
- 缩略图：`文章-slug.jpg`
- 文章内图片：`文章-slug-描述.jpg`
- 全部小写，用横杠分隔

### 视频文件组织

**阿里云 OSS 结构：**
```
OSS Bucket: web-mayfriday-videos
└── resources/
    ├── 1/                        (文章 ID)
    │   ├── hls/
    │   │   └── playlist.m3u8     (HLS 视频)
    │   └── thumbnail.jpg         (视频缩略图)
    ├── 2/
    └── ...
```

---

## 🎨 内容编写技巧

### 1. 结构清晰

使用标题划分章节：
```javascript
// 大章节
{ type: "heading", level: 2, content: "准备材料", ... }

// 子章节
{ type: "heading", level: 3, content: "工具清单", ... }
```

### 2. 图文并茂

每个重要步骤都配图：
```javascript
{ type: "text", content: "第一步：起针..." },
{ type: "image", src: "/images/step1.jpg", ... },
{ type: "text", content: "详细说明..." }
```

### 3. 视频演示

复杂技巧使用视频：
```javascript
{ type: "text", content: "以下视频详细演示..." },
{ type: "video", platform: "oss", src: "...", ... }
```

### 4. 善用提示框

重点信息使用 callout：
```javascript
{ type: "callout", style: "tip", content: "💡 这是一个小技巧" }
{ type: "callout", style: "warning", content: "⚠️ 注意事项" }
```

---

## ✅ 完整示例：添加新文章

```javascript
// 在 src/data/resources.js 的 articles 数组中添加：

{
  id: 9,
  slug: "beginner-scarf-tutorial",
  title: "【新手教程】你的第一条围巾 - 从零开始",
  titleEn: "[Beginner Tutorial] Your First Scarf - From Scratch",
  category: "tutorial",
  author: "张老师",
  authorEn: "Teacher Zhang",
  date: "2026-02-21",
  readTime: "15分钟",
  readTimeEn: "15 min read",
  image: "/images/resources/beginner-scarf.jpg",
  excerpt: "零基础围巾编织教程，手把手教你完成第一条围巾。包含详细的起针、编织、收针步骤...",
  excerptEn: "Beginner-friendly scarf knitting tutorial. Step-by-step guide to complete your first scarf...",
  tags: ["新手", "围巾", "基础教程"],
  tagsEn: ["beginner", "scarf", "basic tutorial"],

  contentBlocks: [
    {
      type: "text",
      content: "欢迎来到编织的世界！这篇教程将带您从零开始，完成第一条手工围巾。",
      contentEn: "Welcome to the world of knitting! This tutorial will guide you from zero to your first handmade scarf."
    },
    {
      type: "heading",
      level: 2,
      content: "准备材料",
      contentEn: "Materials Needed"
    },
    {
      type: "list",
      ordered: false,
      items: [
        { content: "8号竹编织针一对", contentEn: "Size 8 bamboo needles" },
        { content: "中等粗细毛线200克", contentEn: "200g medium weight yarn" }
      ]
    },
    {
      type: "callout",
      style: "tip",
      content: "💡 初学者建议选择浅色毛线，更容易看清针目。",
      contentEn: "💡 Beginners recommended to choose light-colored yarn for easier stitch visibility."
    },
    {
      type: "heading",
      level: 2,
      content: "步骤一：起针",
      contentEn: "Step 1: Cast On"
    },
    {
      type: "text",
      content: "起针是编织的第一步，我们使用最简单的套针起针法...",
      contentEn: "Casting on is the first step. We'll use the simple long-tail cast on method..."
    },
    {
      type: "image",
      src: "/images/resources/scarf-step1.jpg",
      alt: "起针示意图",
      altEn: "Cast on illustration",
      caption: "保持线的松紧适中",
      captionEn: "Keep tension moderate"
    }
  ]
}
```

---

## 🚀 提交流程

修改完 `resources.js` 后：

```bash
# 1. 检查修改
git status

# 2. 添加文件
git add src/data/resources.js

# 3. 提交（附上代理）
export https_proxy=http://127.0.0.1:6152 && \
export http_proxy=http://127.0.0.1:6152 && \
export all_proxy=socks5://127.0.0.1:6153 && \
git commit -m "Add new article: 文章标题" && \
git push origin main

# 4. 等待 Vercel 部署（1-2分钟）

# 5. 访问查看效果
# https://web-mayfriday.vercel.app/resources
```

---

## 💡 常见问题

### Q: 如何添加视频？
A: 参考上面的"视频内容块"示例，支持阿里云 OSS、Bilibili、YouTube。

### Q: 可以添加多少篇文章？
A: 理论上无限制，但建议不超过 100 篇以保持加载速度。

### Q: 如何调整文章顺序？
A: 在 `resources.js` 中调整数组顺序即可，第一个显示在最上面。

### Q: 文章如何分类？
A: 修改 `category` 字段：
- `tutorial` - 教程
- `guide` - 指南
- `tips` - 技巧
- `inspiration` - 灵感

### Q: 需要我帮忙生成文章模板吗？
A: 随时告诉我！提供标题、分类、内容大纲，我帮您生成完整代码。

---

**创建日期**: 2024-02-21
**文档用途**: 指导管理资源文章内容

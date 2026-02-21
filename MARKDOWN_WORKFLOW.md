# 📝 Markdown 文章工作流程 / Markdown Article Workflow

## 🎯 工作流程概览

**您的工作：**
1. 用 Markdown 写文章（简单、直观）
2. 在文章中标记图片和视频位置
3. 把文章和资源放在一个文件夹中
4. 告诉我"文章写好了"

**我的工作：**
1. 读取您的 Markdown 文件
2. 解析内容和标记
3. 生成网页代码（JavaScript）
4. 处理图片和视频路径
5. 提交并部署

---

## 📁 文件组织结构

### 推荐的文件夹结构

```
content/resources/
├── leopard-pouch/              # 文章文件夹（用英文slug命名）
│   ├── article.md              # ✅ Markdown 文章（必需）
│   ├── thumbnail.jpg           # ✅ 缩略图（必需）
│   ├── step1.jpg               # 文章内图片
│   ├── step2.jpg               # 文章内图片
│   └── video-thumb.jpg         # 视频缩略图（如有视频）
│
├── color-guide/
│   ├── article.md
│   ├── thumbnail.jpg
│   ├── color-wheel.jpg
│   └── examples.jpg
│
└── scarf-tutorial/
    ├── article.md
    ├── thumbnail.jpg
    ├── step1.jpg
    ├── step2.jpg
    └── step3.jpg
```

**命名规范：**
- 文件夹名 = URL slug（英文，用横杠分隔）
- `article.md` = 固定文件名
- `thumbnail.jpg` = 缩略图固定名称
- 其他图片自由命名，但要在 Markdown 中引用

---

## ✍️ Markdown 文章格式

### 1. 文章头部（元数据）

每篇文章开头用 `---` 包裹元数据：

```markdown
---
title: 【钩针教程】耐看又俏皮的豹纹笔袋 - 包底包身完整演示
titleEn: [Crochet Tutorial] Stylish Leopard Pattern Pouch
category: tutorial
author: 李雅
authorEn: Li Ya
date: 2026-02-18
readTime: 20分钟
readTimeEn: 20 min read
thumbnail: thumbnail.jpg
tags: 钩针, 笔袋, 豹纹, 视频教程
tagsEn: crochet, pouch, leopard pattern, video tutorial
excerpt: 时尚豹纹图案钩针笔袋教程，包含包底和包身的完整编织演示视频。这款俏皮又实用的小物件，适合进阶学习者...
excerptEn: Fashionable leopard pattern crochet pouch tutorial with complete video demonstration of bottom and body. This stylish and practical piece is suitable for intermediate learners...
---
```

**字段说明：**
- `title` / `titleEn` - 中英文标题（必需）
- `category` - 分类：tutorial / guide / tips / inspiration（必需）
- `author` / `authorEn` - 作者名（必需）
- `date` - 发布日期 YYYY-MM-DD（必需）
- `readTime` / `readTimeEn` - 阅读时间（必需）
- `thumbnail` - 缩略图文件名（必需）
- `tags` / `tagsEn` - 标签，逗号分隔（必需）
- `excerpt` / `excerptEn` - 摘要，2-3句话（必需）

---

### 2. 文章正文（Markdown + 特殊标记）

#### 标准 Markdown 语法

```markdown
## 这是二级标题

这是普通段落文本。可以使用**粗体**、*斜体*等格式。

### 这是三级标题

- 无序列表项 1
- 无序列表项 2
- 无序列表项 3

1. 有序列表项 1
2. 有序列表项 2
3. 有序列表项 3
```

#### 插入图片

**基本语法：**
```markdown
![图片描述](图片文件名)
```

**带说明文字：**
```markdown
![步骤一示意图](step1.jpg "保持线的松紧适中")
```

**说明：**
- `图片描述` = alt 文字（SEO 和无障碍）
- `图片文件名` = 文件夹中的图片文件
- `"引号中的文字"` = 图片下方显示的说明文字（可选）

**示例：**
```markdown
## 步骤一：起针

详细说明起针的方法...

![起针示意图](step1.jpg "从环形起针开始")

继续后面的说明...
```

---

#### 插入视频

**语法：**
```markdown
:::video
src: video-file.mp4
或
src: https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/1/hls/playlist.m3u8
platform: oss
thumbnail: video-thumb.jpg
duration: 19:10
title: 豹纹笔袋完整教程 - 包底包身编织演示
titleEn: Leopard Pouch Complete Tutorial
:::
```

**字段说明：**
- `src` - 视频源（本地文件名 或 完整 URL）
- `platform` - 平台：oss / bilibili / youtube（默认 oss）
- `thumbnail` - 视频缩略图文件名
- `duration` - 视频时长 MM:SS
- `title` / `titleEn` - 视频标题

**本地视频示例：**
```markdown
:::video
src: tutorial-video.mp4
thumbnail: video-thumb.jpg
duration: 15:30
title: 完整编织演示
titleEn: Complete Tutorial
:::
```

**阿里云 OSS 视频示例：**
```markdown
:::video
src: https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/1/hls/playlist.m3u8
platform: oss
thumbnail: https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/resources/1/thumbnail.jpg
duration: 19:10
title: 豹纹笔袋完整教程
titleEn: Leopard Pouch Tutorial
:::
```

**Bilibili 视频示例：**
```markdown
:::video
src: https://player.bilibili.com/player.html?bvid=BV1xx411c7mD
platform: bilibili
thumbnail: bilibili-thumb.jpg
duration: 20:00
title: B站教程视频
titleEn: Tutorial on Bilibili
:::
```

---

#### 提示框

**4 种样式：**

**信息框（蓝色）：**
```markdown
:::info
ℹ️ 这个项目适合已经掌握基础钩针技法的学习者。
:::
```

**技巧框（绿色）：**
```markdown
:::tip
💡 豹纹花样的关键在于配色的随机性。不要让斑点分布太规则！
:::
```

**警告框（黄色）：**
```markdown
:::warning
⚠️ 注意保持针目均匀，避免松紧不一。
:::
```

**成功框（绿色）：**
```markdown
:::success
✅ 恭喜！完成这个步骤后，您的作品就完成了一半。
:::
```

**英文版本（可选）：**
```markdown
:::tip
💡 豹纹花样的关键在于配色的随机性。
---
💡 The key to leopard pattern is randomness in color placement.
:::
```

使用 `---` 分隔中英文内容。

---

## 📝 完整示例文章

### 示例：article.md

```markdown
---
title: 【新手教程】你的第一条围巾 - 从零开始
titleEn: [Beginner Tutorial] Your First Scarf - From Scratch
category: tutorial
author: 张老师
authorEn: Teacher Zhang
date: 2026-02-21
readTime: 15分钟
readTimeEn: 15 min read
thumbnail: thumbnail.jpg
tags: 新手, 围巾, 基础教程
tagsEn: beginner, scarf, basic tutorial
excerpt: 零基础围巾编织教程，手把手教你完成第一条围巾。包含详细的起针、编织、收针步骤，适合完全没有经验的初学者。
excerptEn: Beginner-friendly scarf knitting tutorial. Step-by-step guide to complete your first scarf, perfect for complete beginners.
---

欢迎来到编织的世界！这篇教程将带您从零开始，完成第一条手工围巾。不需要任何经验，只需要耐心和一颗想要学习的心。

## 准备材料

在开始之前，您需要准备以下材料：

- 8号竹编织针一对
- 中等粗细毛线200克（推荐浅色）
- 剪刀
- 缝纫针（用于藏线头）

:::tip
💡 初学者建议选择浅色毛线，这样更容易看清针目，方便学习。
---
💡 Beginners recommended to choose light-colored yarn for easier stitch visibility.
:::

## 步骤一：起针

起针是编织的第一步，也是最重要的基础。我们使用最简单的套针起针法。

![起针示意图](step1.jpg "保持线的松紧适中")

### 详细步骤

1. 留出约50cm的线尾（用于后续缝合）
2. 将毛线在左手上绕成套环
3. 右手拿针，穿过套环
4. 拉紧，完成第一针

重复以上步骤，起针30-35针。

:::warning
⚠️ 起针不要太紧，否则后续编织会很困难。保持松紧适中是关键。
:::

## 步骤二：平针编织

起针完成后，就可以开始编织了。我们使用最基础的平针（Garter Stitch）。

![编织过程](step2.jpg "保持针目均匀")

### 编织技巧

- 每一针都保持相同的松紧度
- 不要拉得太紧，也不要太松
- 编织到行尾时，翻转针，开始新的一行

:::video
src: knitting-demo.mp4
thumbnail: video-thumb.jpg
duration: 8:30
title: 平针编织详细演示
titleEn: Garter Stitch Detailed Demo
:::

继续编织，直到围巾达到您想要的长度（通常150-180cm）。

## 步骤三：收针

当围巾达到理想长度后，需要收针来完成作品。

![收针步骤](step3.jpg "确保收针均匀")

### 收针方法

1. 编织前两针
2. 用左针挑起右针上的第一针
3. 将其套过第二针并脱落
4. 重复以上步骤直到只剩一针
5. 剪断毛线，穿过最后一针并拉紧

:::success
✅ 恭喜！您的第一条围巾完成了！
---
✅ Congratulations! Your first scarf is complete!
:::

## 后续整理

完成编织后，还需要做一些整理工作：

- 用缝纫针将所有线头藏入织物中
- 轻轻蒸汽熨烫，使围巾更平整
- 第一次手洗后晾干

![成品展示](finished.jpg "您的第一条手工围巾")

## 常见问题

### 为什么我的围巾边缘不整齐？

这是初学者最常见的问题。主要原因是：

- 边缘针目松紧不一
- 漏针或多针
- 转针时没有保持张力

:::tip
💡 解决方法：每行开始前数一数针数，确保和起针时一致。边缘第一针和最后一针可以稍微拉紧一点。
:::

### 需要多长时间完成？

对于初学者来说，完成一条围巾通常需要：

- 每天编织1小时：约10-15天
- 每天编织2小时：约5-7天
- 周末集中编织：2-3个周末

不要着急，慢慢享受编织的过程！

## 下一步学习

完成第一条围巾后，您可以尝试：

1. 编织帽子或头巾
2. 学习下针和上针
3. 尝试简单的花样编织
4. 参加编织社群，与其他爱好者交流

祝您编织愉快！🧶

---

*作者简介：张老师从事手工编织教学15年，擅长将复杂技法简单化，帮助无数学员入门编织。*
```

---

## 🚀 使用流程

### 第一步：创建文件夹

```bash
# 在项目中创建内容文件夹
mkdir -p content/resources/my-article

# 进入文件夹
cd content/resources/my-article
```

### 第二步：编写 Markdown

在文件夹中创建 `article.md`：

```bash
# Mac/Linux
touch article.md
open article.md

# 或用您喜欢的编辑器
code article.md  # VS Code
```

### 第三步：添加图片和视频

将图片拖入文件夹：
```
content/resources/my-article/
├── article.md        ✅
├── thumbnail.jpg     ✅
├── step1.jpg         ✅
├── step2.jpg         ✅
└── video-thumb.jpg   ✅
```

### 第四步：告诉我

**只需说：**
- "文章写好了"
- "帮我发布文章"
- "my-article 文件夹准备好了"

**我会：**
1. 读取您的 Markdown 文件
2. 解析内容和标记
3. 生成 JavaScript 代码
4. 复制图片到正确位置
5. 提交并部署
6. 告诉您结果

---

## 📋 快速参考

### Markdown 特殊语法速查

| 功能 | 语法 |
|------|------|
| 图片 | `![描述](文件名)` |
| 带说明的图片 | `![描述](文件名 "说明")` |
| 视频 | `:::video ... :::` |
| 信息框 | `:::info ... :::` |
| 技巧框 | `:::tip ... :::` |
| 警告框 | `:::warning ... :::` |
| 成功框 | `:::success ... :::` |

### 元数据字段速查

必需字段：
- title / titleEn
- category
- author / authorEn
- date
- readTime / readTimeEn
- thumbnail
- tags / tagsEn
- excerpt / excerptEn

---

## 💡 优势

**相比直接编辑代码文件：**
- ✅ 更简单 - Markdown 比 JavaScript 容易写
- ✅ 更直观 - 所见即所得
- ✅ 更灵活 - 专注内容，不用管格式
- ✅ 更安全 - 不会因为代码错误导致网站崩溃
- ✅ 更高效 - 我来处理技术细节
- ✅ 更易管理 - 每篇文章独立文件夹

**您只需：**
1. 写 Markdown
2. 放图片
3. 告诉我

**我负责：**
1. 解析
2. 生成代码
3. 部署
4. 上线

---

## 🎯 下一步

**准备好了吗？**

1. **现在就试试** - 创建第一篇 Markdown 文章
2. **我帮您转换** - 告诉我文件夹路径
3. **立即上线** - 几分钟后就能看到效果

**需要帮助？**
- 不确定怎么写？看上面的完整示例
- 想要模板？告诉我主题，我生成给您
- 遇到问题？随时问我

---

**创建日期**: 2026-02-21
**版本**: 1.0
**工作流**: Markdown → 我解析 → 生成代码 → 部署上线

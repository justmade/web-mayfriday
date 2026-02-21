# Markdown 文章模板 / Article Template

复制这个模板开始写您的文章！

---

```markdown
---
title: 【分类】文章标题 - 副标题
titleEn: [Category] Article Title - Subtitle
category: tutorial
author: 您的名字
authorEn: Your Name
date: 2026-02-21
readTime: 15分钟
readTimeEn: 15 min read
thumbnail: thumbnail.jpg
tags: 标签1, 标签2, 标签3
tagsEn: tag1, tag2, tag3
excerpt: 这里写2-3句话的文章摘要，会显示在资源列表页面...
excerptEn: Write 2-3 sentences as article summary, will be displayed on resource list page...
---

这是文章的开头段落。介绍文章的主题和内容。

## 第一个章节标题

这里是第一个章节的内容。可以使用**粗体**、*斜体*等格式。

### 小标题（如果需要）

更详细的内容...

## 准备材料（示例）

- 材料1
- 材料2
- 材料3

:::tip
💡 这是一个小技巧提示框
:::

## 步骤说明

### 步骤一：xxx

详细说明...

![步骤一示意图](step1.jpg "这里是图片说明文字")

继续说明...

### 步骤二：xxx

详细说明...

![步骤二示意图](step2.jpg)

:::video
src: video-file.mp4
或
src: https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/xxx/playlist.m3u8
platform: oss
thumbnail: video-thumb.jpg
duration: 10:30
title: 视频标题
titleEn: Video Title
:::

## 注意事项

:::warning
⚠️ 这是警告提示框
:::

## 总结

文章总结内容...

:::success
✅ 恭喜完成！
:::
```

---

## 使用步骤

1. **创建文件夹**
   ```bash
   mkdir content/resources/my-article-name
   cd content/resources/my-article-name
   ```

2. **复制模板**
   - 复制上面的内容
   - 保存为 `article.md`

3. **编辑内容**
   - 修改元数据（标题、作者等）
   - 编写文章内容
   - 标记图片和视频位置

4. **添加资源文件**
   - 添加 `thumbnail.jpg`（缩略图）
   - 添加文章内图片（step1.jpg, step2.jpg 等）
   - 添加视频缩略图（如有视频）

5. **告诉 Claude**
   - "文章写好了"
   - 或 "my-article-name 文件夹准备好了"

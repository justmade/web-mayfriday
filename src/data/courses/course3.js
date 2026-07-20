const coverImage = "/images/courses/course3/cover.jpg"
const videoUrl = "https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/courses/course3/playlist.m3u8"

export const course3Data = {
  id: "course3",
  title: "编织手链课程",
  titleEn: "Woven Bracelet Course",
  description: "通过完整视频学习编织手链的材料准备、经线固定、图案编织和收尾方法，跟随演示完成一条手链。",
  descriptionEn: "Follow the complete video tutorial to prepare materials, set the warp, weave the pattern, finish the ends, and complete a bracelet.",
  coverImage,
  difficulty: "beginner",
  difficultyEn: "Beginner",
  duration: "47 分钟",
  durationEn: "47 minutes",
  lessons: [
    {
      index: 0,
      title: "编织手链完整视频",
      titleEn: "Complete Woven Bracelet Tutorial",
      contentBlocks: [
        {
          type: "text",
          content: "本节视频完整演示编织手链的制作过程。建议准备好材料和工具，跟随视频分段练习。",
          contentEn: "This video demonstrates the complete bracelet-making process. Prepare your materials and tools, then follow along at your own pace.",
        },
        {
          type: "video",
          platform: "oss",
          src: videoUrl,
          thumbnail: coverImage,
          duration: "47:23",
          title: "编织手链完整视频",
          titleEn: "Complete Woven Bracelet Tutorial",
        },
      ],
    },
  ],
}

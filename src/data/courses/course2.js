const imageBase = "/images/courses/course2"
const videoBase = "https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/courses/course2"

const pendingVideoBlock = (thumbnail, title, titleEn) => [
  {
    type: "image",
    src: `${imageBase}/${thumbnail}`,
    alt: title,
    altEn: titleEn,
  },
  {
    type: "callout",
    style: "info",
    content: "本节视频正在整理并上传至课程播放服务，上传完成后将在此处直接播放。",
    contentEn: "This lesson video is being prepared and uploaded. It will play directly here once available.",
  },
]

export const course2Data = {
  id: "course2",
  title: "萨米织带零基础课程",
  titleEn: "Sámi Band Weaving Beginner Course",
  description: "从排织基础开始，认识萨米织带的历史、工具与图解原理，逐步完成取线、穿线、编织和收尾，并学习 Sigga 提花图样。",
  descriptionEn: "Start with plain band weaving, learn the history, tools, and pattern principles of Sámi bands, then work through warping, weaving, finishing, and the Sigga pattern.",
  coverImage: `${imageBase}/第1页-1.jpeg`,
  difficulty: "beginner",
  difficultyEn: "Beginner",
  duration: "自定进度",
  durationEn: "Self-paced",
  introImages: [
    `${imageBase}/第1页-2.png`,
    `${imageBase}/第3页-1.jpeg`,
  ],
  galleryImages: [
    `${imageBase}/第4页-1.jpeg`,
    `${imageBase}/第5页-1.jpeg`,
    `${imageBase}/第6页-1.jpeg`,
    `${imageBase}/第13页-1.jpeg`,
  ],
  lessons: [
    {
      index: 0,
      title: "萨米织带历史",
      titleEn: "History of Sámi Band Weaving",
      contentBlocks: [
        {
          type: "callout",
          style: "warning",
          content: "店铺内所有教程与编织作品均为本人原创设计及独立制作，请勿私下转载。",
          contentEn: "All tutorials and works in this shop are original designs and independently produced. Please do not reproduce without permission.",
        },
        {
          type: "text",
          content: "这种立体提花织带被称为「Sámi Band」。萨米人是生活在瑞典北部、挪威、芬兰和俄罗斯地区的原住民族。",
          contentEn: "This raised-pattern woven band is known as a Sámi Band. The Sámi are Indigenous people living across northern Sweden, Norway, Finland, and Russia.",
        },
        {
          type: "text",
          content: "传统萨米织带工具由驯鹿角雕刻成简单综片，便于携带，适合游牧生活。织带通常使用手工染色羊毛线制作，常用于脚踝处包裹鞋子，起到防湿和保暖作用。",
          contentEn: "Traditional Sámi band tools were simple heddles carved from reindeer antler, making them portable for a nomadic lifestyle. The bands were commonly woven from hand-dyed wool and wrapped around footwear for warmth and protection from moisture.",
        },
        {
          type: "image",
          src: `${imageBase}/第3页-1.jpeg`,
          alt: "萨米织带历史与传统用途",
          altEn: "History and traditional uses of Sámi bands",
        },
      ],
    },
    {
      index: 1,
      title: "学萨米前先学排织",
      titleEn: "Learn Plain Band Weaving First",
      contentBlocks: [
        {
          type: "text",
          content: "在进入萨米提花之前，先通过排织掌握基本的织口变化、梭子通过方式和张力控制。稳定的基础织带是后续提花学习的关键。",
          contentEn: "Before starting Sámi pattern weaving, use plain band weaving to understand shed changes, shuttle movement, and tension control. A stable foundation is essential for successful pattern weaving.",
        },
        {
          type: "video",
          platform: "oss",
          src: `${videoBase}/inkle-basics/playlist.m3u8`,
          thumbnail: `${imageBase}/第4页-1.jpeg`,
          duration: "16:25",
          title: "学萨米前先学排织",
          titleEn: "Learn Plain Band Weaving First",
        },
      ],
    },
    {
      index: 2,
      title: "编织固定器使用说明",
      titleEn: "Using the Weaving Holder",
      contentBlocks: [
        {
          type: "text",
          content: "本节介绍编织固定器的安装、固定方式和使用姿势。开始编织前，请确认固定器稳定，并根据作品长度预留足够空间。",
          contentEn: "This lesson covers setup, anchoring, and working position for the weaving holder. Before weaving, make sure the holder is stable and leave enough space for the planned band length.",
        },
        ...pendingVideoBlock("第5页-1.jpeg", "编织固定器使用说明", "Using the Weaving Holder"),
      ],
    },
    {
      index: 3,
      title: "取线方法",
      titleEn: "Warping Method",
      contentBlocks: [
        {
          type: "text",
          content: "按照图解规划颜色和线材数量，再进行取线。保持每组经线长度一致，可以减少后续调整张力的难度。",
          contentEn: "Plan colors and thread counts from the pattern before warping. Keeping every warp group the same length makes tension adjustment much easier later.",
        },
        ...pendingVideoBlock("第6页-1.jpeg", "取线方法", "Warping Method"),
      ],
    },
    {
      index: 4,
      title: "工具与辅具介绍",
      titleEn: "Tools and Accessories",
      contentBlocks: [
        {
          type: "text",
          content: "认识萨米编织板、梭子、钩针及固定工具，并根据图样宽度选择合适规格的编织板。",
          contentEn: "Get familiar with the Sámi heddle, shuttle, hook, and anchoring tools, and choose the right heddle size for the pattern width.",
        },
        ...pendingVideoBlock("第7页-1.png", "工具与辅具介绍", "Tools and Accessories"),
      ],
    },
    {
      index: 5,
      title: "图解与原理",
      titleEn: "Pattern Charts and Principles",
      contentBlocks: [
        {
          type: "text",
          content: "学习识别长槽、短槽和孔位，理解基础线与提花线的关系，并从图样中心开始安排穿线位置。",
          contentEn: "Learn to identify long slots, short slots, and holes, understand the relationship between ground and pattern threads, and lay out threading from the center of the pattern.",
        },
        {
          type: "callout",
          style: "tip",
          content: "五格提花图样需要从中心点开始穿线，提花部分和边缘部分会有需要空开的位置。完整穿线图请在课程最后下载。",
          contentEn: "Five-cell patterns must be threaded from the center. Some positions between the pattern and border sections remain empty. Download the complete threading charts in the final lesson.",
        },
        ...pendingVideoBlock("第8页-1.png", "图解与原理", "Pattern Charts and Principles"),
      ],
    },
    {
      index: 6,
      title: "编织前的准备",
      titleEn: "Preparing to Weave",
      contentBlocks: [
        {
          type: "text",
          content: "检查穿线顺序、经线张力和固定位置。正式开始前先织一小段基础组织，让所有经线稳定排列。",
          contentEn: "Check the threading order, warp tension, and anchor points. Weave a short foundation section before starting the pattern so all warp threads settle evenly.",
        },
        ...pendingVideoBlock("第10页-1.png", "编织前的准备", "Preparing to Weave"),
      ],
    },
    {
      index: 7,
      title: "开始编织",
      titleEn: "Start Weaving",
      contentBlocks: [
        {
          type: "text",
          content: "按照图解逐行挑起提花线，同时保持基础组织和边缘张力稳定。每完成数行后检查图案，及时修正错线。",
          contentEn: "Pick up pattern threads row by row while keeping the ground weave and edge tension stable. Check the motif every few rows and correct mistakes early.",
        },
        ...pendingVideoBlock("第11页-1.png", "开始编织", "Start Weaving"),
      ],
    },
    {
      index: 8,
      title: "收尾处理",
      titleEn: "Finishing",
      contentBlocks: [
        {
          type: "text",
          content: "完成图样后固定纬线并整理线头。根据织带用途选择打结、编辫、缝合或安装五金等收尾方式。",
          contentEn: "Secure the weft and tidy the loose ends after completing the pattern. Choose knots, braids, stitching, or hardware according to how the finished band will be used.",
        },
        ...pendingVideoBlock("第12页-1.png", "收尾处理", "Finishing"),
      ],
    },
    {
      index: 9,
      title: "2025 更新：Sigga 图样",
      titleEn: "2025 Update: Sigga Pattern",
      contentBlocks: [
        {
          type: "text",
          content: "本节补充 Sigga 提花图样的穿线与编织方法。建议完成前面的基础章节后再练习，并配合下载包中的 Sigga 图解使用。",
          contentEn: "This update covers threading and weaving the Sigga pattern. Complete the foundation lessons first, then follow along with the Sigga charts in the downloadable pattern pack.",
        },
        ...pendingVideoBlock("第13页-1.jpeg", "2025 更新：Sigga 图样", "2025 Update: Sigga Pattern"),
      ],
    },
    {
      index: 10,
      title: "课程图解下载",
      titleEn: "Download Course Pattern Charts",
      contentBlocks: [
        {
          type: "text",
          content: "下载包包含排织、萨米和 Sigga 三组课程图解及详细穿线参考图。建议解压后按照章节和图样名称分类使用。",
          contentEn: "The download includes the Inkle, Sámi, and Sigga chart sets with detailed threading references. Unzip the package and use the files alongside the matching lessons and pattern names.",
        },
        {
          type: "attachment",
          src: "/files/courses/course2/萨米织带课程图解汇总.zip",
          filename: "萨米织带课程图解汇总.zip",
          label: "萨米织带课程图解汇总.zip",
          labelEn: "Sámi Band Course Pattern Charts.zip",
          description: "课程配套图解原图，ZIP 压缩包",
          descriptionEn: "Original course pattern charts, ZIP archive",
        },
      ],
    },
  ],
}

export const course1Data = {
  id: "course1",
  title: "卡织入门课程",
  titleEn: "Card Weaving Beginner Course",
  description: "从零开始学习卡织，掌握工具使用、线材选择、穿线方向等核心知识，并跟随视频完成第一件卡织作品。",
  descriptionEn: "Learn card weaving from scratch — tools, yarn selection, threading direction, and follow along videos to complete your first piece.",
  coverImage: "/images/courses/course1/封面.jpg",
  difficulty: "beginner",
  difficultyEn: "Beginner",
  duration: "自定进度",
  durationEn: "Self-paced",
  galleryImages: [
    "/images/courses/course1/什么是卡织-1.png",
    "/images/courses/course1/工具介绍-卡片与梭子-1.jpeg",
    "/images/courses/course1/S-Z穿线方向说明.png",
    "/images/courses/course1/线材介绍.png",
  ],
  lessons: [
    {
      index: 0,
      title: "什么是卡织",
      titleEn: "What is Card Weaving",
      contentBlocks: [
        {
          type: "text",
          content: "【卡织】英文名为 tablet weaving（在美国常被称为 card weaving），是源自中世纪欧洲，已有400多年历史的一项编织技艺，现今在国外依旧很流行。",
          contentEn: "Card weaving (also called tablet weaving) is a weaving technique originating from medieval Europe with over 400 years of history, still widely practiced internationally today."
        },
        {
          type: "text",
          content: "有坚持用传统方式编织的部落，也有开发出各式现代工具的都市编织爱好者们。更有很多时尚品牌尝试将卡织元素融入自己的设计中，制作成包带、相机带、吉他带、腰带、鞋带、织物边缘装饰等现代装饰品。",
          contentEn: "Some communities maintain traditional techniques, while urban crafters develop modern tools. Many fashion brands incorporate card weaving into their designs — bag straps, camera straps, guitar straps, belts, shoelaces, and decorative trims."
        },
        {
          type: "image",
          src: "/images/courses/course1/什么是卡织-1.png",
          alt: "卡织示例图",
          altEn: "Card weaving example",
        },
        {
          type: "image",
          src: "/images/courses/course1/什么是卡织-2.png",
          alt: "卡织作品",
          altEn: "Card weaving work",
        },
        {
          type: "callout",
          style: "info",
          content: "店铺内所有教程与编织作品均为本人原创设计及独立制作，请勿私下转载。",
          contentEn: "All tutorials and works in this shop are original designs. Please do not reproduce without permission."
        },
      ],
    },
    {
      index: 1,
      title: "工具介绍 - 卡片与梭子",
      titleEn: "Tools - Cards & Shuttle",
      contentBlocks: [
        {
          type: "text",
          content: "关于卡片，古时候人们会用金属、皮、木片等材质来制作。虽然都是经久耐用的材料，但个人认为重量过重的卡片在编织时过于累赘，体验并不好。如果买了店铺里的 PVC 卡片就会知道轻盈的材料是比较好的选择。",
          contentEn: "Historically, cards were made from metal, leather, or wood — durable but heavy. Lightweight PVC cards from the shop offer a much better weaving experience."
        },
        {
          type: "text",
          content: "卡织卡片不止4孔，也有3孔和5孔等，不过4孔是最常用的，就像基础的织布机由4个棕片来控制花纹一样。孔的数量越多，花纹的变化也就越多。",
          contentEn: "While cards come in 3-hole and 5-hole variants, 4-hole cards are most common — similar to how a basic loom uses 4 shafts to control patterns. More holes allow more pattern complexity."
        },
        {
          type: "image",
          src: "/images/courses/course1/工具介绍-卡片与梭子-1.jpeg",
          alt: "卡片工具",
          altEn: "Weaving cards",
        },
        {
          type: "image",
          src: "/images/courses/course1/工具介绍-卡片与梭子-2.png",
          alt: "卡片示意图",
          altEn: "Cards diagram",
        },
        {
          type: "text",
          content: "关于梭子，这不是一个必须的工具，因为卡织多用来制作织带，宽幅不会很大，没有的话也可以用卡片自制，或者用塑料绕线器代替，甚至绕成小线团使用也完全没有问题。但如果是宽幅较大的作品，就必须要用到梭子来帮助穿过长长的织口。",
          contentEn: "A shuttle is not strictly required since card weaving usually produces narrow bands. You can substitute with a homemade card shuttle or plastic bobbin. For wider pieces, a proper shuttle is essential."
        },
        {
          type: "image",
          src: "/images/courses/course1/工具介绍-卡片与梭子-3.jpeg",
          alt: "梭子工具",
          altEn: "Shuttle tool",
        },
      ],
    },
    {
      index: 2,
      title: "取线工具",
      titleEn: "Yarn Tensioning Setup",
      contentBlocks: [
        {
          type: "text",
          content: "在教程中使用的取线工具为两个桌面固定夹（F夹），这个方法适用于长度较短的作品，2m以内较合适。",
          contentEn: "This tutorial uses two desk clamps (F-clamps) for yarn tensioning, suitable for pieces up to 2 meters long."
        },
        {
          type: "text",
          content: "一般日常制作的包带、腰带等都已经完全够用。",
          contentEn: "This setup is sufficient for everyday projects like bag straps and belts."
        },
        {
          type: "image",
          src: "/images/courses/course1/取线工具-1.jpeg",
          alt: "取线工具示例",
          altEn: "Yarn tensioning setup",
        },
        {
          type: "image",
          src: "/images/courses/course1/取线工具-2.jpeg",
          alt: "F夹固定方式",
          altEn: "F-clamp setup",
        },
      ],
    },
    {
      index: 3,
      title: "固定线材工具",
      titleEn: "Securing the Warp",
      contentBlocks: [
        {
          type: "text",
          content: "基础教程中我们使用的是零成本方式，一头与腰带固定，一头与F夹固定。家里的皮带、腰带、织带都可以拿来使用。F夹也可以替换成柜子把手、椅背等。",
          contentEn: "The beginner method uses zero-cost materials: one end attached to a belt worn on your body, the other to an F-clamp. Any belt, strap, or handle works as an anchor."
        },
        {
          type: "callout",
          style: "tip",
          content: "TIPS：如果腰椎不太好，建议使用2.5cm以上宽度的织带，并固定在骶骨而非腰椎的位置，这样长时间编织也不易产生不适。",
          contentEn: "TIP: If you have lower back issues, use a waistband wider than 2.5cm and position it at the sacrum rather than the lumbar spine to avoid discomfort during long weaving sessions."
        },
        {
          type: "image",
          src: "/images/courses/course1/固定线材工具-1.jpeg",
          alt: "固定方式示例",
          altEn: "Securing method example",
        },
        {
          type: "image",
          src: "/images/courses/course1/固定线材工具-2.png",
          alt: "固定线材工具图示",
          altEn: "Warp securing diagram",
        },
        {
          type: "image",
          src: "/images/courses/course1/固定线材工具-3.jpeg",
          alt: "实际固定效果",
          altEn: "Actual securing setup",
        },
      ],
    },
    {
      index: 4,
      title: "线材介绍",
      titleEn: "Yarn Introduction",
      contentBlocks: [
        {
          type: "text",
          content: "关于线材，我的回答常常是「其实什么线材都可以」。但你需要先了解不同纤维的特性。课程材料包中选择了纯棉、亚麻两种材质。个人偏好天然材料。",
          contentEn: "While almost any yarn can be used, you should understand different fiber properties. The course kit includes pure cotton and linen — natural materials are preferred."
        },
        {
          type: "text",
          content: "羊毛线较娇贵，价格高，易断易起球，建议熟练后再尝试。线材选择还与纺线方式有关。纱线一般经过「先捻后合股」两步。捻度越强、合股数量越多，线材越强韧。初学建议选择强度较高的线材，如棉质或亚麻蕾丝线。",
          contentEn: "Wool is delicate, expensive, and prone to breaking and pilling — save it for later. Yarn strength depends on twist and plying. Beginners should choose strong yarns like cotton or linen lace thread."
        },
        {
          type: "text",
          content: "课程使用8号蕾丝线（约0.5-0.7mm），适合制作2cm以下宽幅织带。钥匙圈织带宽度2cm，使用24张卡片；宠物项圈1.5cm，18-20张卡片；手链0.8cm，10张卡片。线越细纹理越细腻但耗时，线越粗制作速度更快且厚度增加。",
          contentEn: "The course uses #8 lace thread (0.5-0.7mm diameter), suitable for bands up to 2cm wide: keyring strap 2cm (24 cards), pet collar 1.5cm (18-20 cards), bracelet 0.8cm (10 cards). Finer thread = more delicate texture but slower; thicker = faster and thicker band."
        },
        {
          type: "image",
          src: "/images/courses/course1/线材介绍.jpeg",
          alt: "线材对比",
          altEn: "Yarn comparison",
        },
        {
          type: "image",
          src: "/images/courses/course1/线材介绍.png",
          alt: "线材介绍图示",
          altEn: "Yarn types diagram",
        },
      ],
    },
    {
      index: 5,
      title: "S / Z 穿线方向说明",
      titleEn: "S / Z Threading Direction",
      contentBlocks: [
        {
          type: "text",
          content: "视频中详细讲解了S/Z的穿线方向。图解中用斜杠表示：去掉字母Z的上下横线得到"/"方向；反方向即为S。",
          contentEn: "The video explains S/Z threading direction in detail. In diagrams, a forward slash \"/\" represents Z-threading; the reverse direction is S."
        },
        {
          type: "text",
          content: "图示为经典又简单的卡织图形，可自行尝试制作。",
          contentEn: "The diagram shows a classic simple card weaving pattern you can try on your own."
        },
        {
          type: "image",
          src: "/images/courses/course1/S-Z穿线方向说明.png",
          alt: "S/Z穿线方向图解",
          altEn: "S/Z threading direction diagram",
        },
      ],
    },
    {
      index: 6,
      title: "理论知识视频",
      titleEn: "Theory Video",
      contentBlocks: [
        {
          type: "text",
          content: "点击缩略图即可打开视频链接",
          contentEn: "Click the thumbnail to open the video link"
        },
        {
          type: "callout",
          style: "info",
          content: "提取码：byqr",
          contentEn: "Access code: byqr"
        },
        {
          type: "videoLink",
          thumbnail: "/images/courses/course1/理论知识视频.png",
          label: "点击观看理论知识视频（提取码：byqr）",
          labelEn: "Click to watch theory video (access code: byqr)",
        },
      ],
    },
    {
      index: 7,
      title: "开始编织视频",
      titleEn: "Start Weaving Video",
      contentBlocks: [
        {
          type: "text",
          content: "点击缩略图即可打开视频链接",
          contentEn: "Click the thumbnail to open the video link"
        },
        {
          type: "videoLink",
          thumbnail: "/images/courses/course1/开始编织视频.jpeg",
          label: "点击观看开始编织视频",
          labelEn: "Click to watch start weaving video",
        },
      ],
    },
    {
      index: 8,
      title: "手链制作视频",
      titleEn: "Bracelet Making Video",
      contentBlocks: [
        {
          type: "text",
          content: "点击缩略图即可打开视频链接",
          contentEn: "Click the thumbnail to open the video link"
        },
        {
          type: "videoLink",
          thumbnail: "/images/courses/course1/手链制作视频.jpeg",
          label: "点击观看手链制作视频",
          labelEn: "Click to watch bracelet making video",
        },
      ],
    },
  ],
}

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
    // ── Lesson 0：什么是卡织 ──────────────────────────────────────
    {
      index: 0,
      title: "什么是卡织",
      titleEn: "What is Card Weaving",
      contentBlocks: [
        {
          type: "callout",
          style: "warning",
          content: "店铺内所有教程与编织作品均为本人原创设计及独立制作，请勿私下转载。",
          contentEn: "All tutorials and works in this shop are original designs and independently produced. Please do not reproduce without permission.",
        },
        {
          type: "text",
          content: "【卡织】英文名为 tablet weaving（在美国常被称为 card weaving），是源自中世纪欧洲，已有400多年历史的一项编织技艺，现今在国外依旧很流行。",
          contentEn: "Card weaving (also called tablet weaving) is a weaving technique originating from medieval Europe with over 400 years of history, still widely practiced internationally today.",
        },
        {
          type: "text",
          content: "有坚持用传统方式编织的部落，也有开发出各式现代工具的都市编织爱好者们。更有很多时尚品牌尝试将卡织元素融入自己的设计中，制作成包带、相机带、吉他带、腰带、鞋带、织物边缘装饰等现代装饰品。",
          contentEn: "Some communities maintain traditional techniques, while urban crafters develop modern tools. Many fashion brands incorporate card weaving into their designs — bag straps, camera straps, guitar straps, belts, shoelaces, and decorative trims.",
        },
        {
          type: "image",
          src: "/images/courses/course1/什么是卡织-1.png",
          alt: "传统卡织编织场景",
          altEn: "Traditional card weaving scene",
        },
        {
          type: "image",
          src: "/images/courses/course1/什么是卡织-2.png",
          alt: "现代卡织作品",
          altEn: "Modern card weaving works",
        },
      ],
    },

    // ── Lesson 1：工具介绍 - 卡片与梭子 ──────────────────────────
    {
      index: 1,
      title: "工具介绍 - 卡片与梭子",
      titleEn: "Tools - Cards & Shuttle",
      contentBlocks: [
        {
          type: "heading",
          level: 3,
          content: "卡片",
          contentEn: "Weaving Cards",
        },
        {
          type: "image",
          src: "/images/courses/course1/工具介绍-卡片与梭子-2.png",
          alt: "卡片孔位示意图（A/B/C/D四孔）",
          altEn: "Card holes diagram (A/B/C/D four holes)",
        },
        {
          type: "text",
          content: "关于卡片，古时候人们会用金属、皮、木片等材质来制作。虽然都是经久耐用的材料，但个人认为重量过重的卡片在编织时过于累赘，体验并不好。如果买了店铺里的 PVC 卡片就会知道轻盈的材料是比较好的选择。",
          contentEn: "Historically, cards were made from metal, leather, or wood — durable but heavy. Lightweight PVC cards from the shop offer a much better weaving experience.",
        },
        {
          type: "text",
          content: "卡织卡片不止4孔，也有3孔和5孔等，不过4孔是最常用的，就像基础的织布机由4个棕片来控制花纹一样。孔的数量越多，花纹的变化也就越多。",
          contentEn: "While cards come in 3-hole and 5-hole variants, 4-hole cards are most common — similar to how a basic loom uses 4 shafts to control patterns. More holes allow more pattern complexity.",
        },
        {
          type: "heading",
          level: 3,
          content: "梭子",
          contentEn: "Shuttle",
        },
        {
          type: "image",
          src: "/images/courses/course1/工具介绍-卡片与梭子-1.jpeg",
          alt: "梭子工具",
          altEn: "Shuttle tool",
        },
        {
          type: "text",
          content: "关于梭子，这不是一个必须的工具，因为卡织多用来制作织带，宽幅不会很大，没有的话也可以用卡片自制，或者用塑料绕线器代替，甚至绕成小线团使用也完全没有问题。",
          contentEn: "A shuttle is not strictly required since card weaving usually produces narrow bands. You can substitute with a homemade card shuttle or plastic bobbin — even a small wound yarn ball works fine.",
        },
        {
          type: "text",
          content: "但如果是像下图这种宽幅较大的作品，就必须要用到梭子来帮助我们穿过长长的织口了。",
          contentEn: "However, for wider pieces like the one shown below, a proper shuttle is essential to pass through the long shed.",
        },
        {
          type: "image",
          src: "/images/courses/course1/工具介绍-卡片与梭子-3.jpeg",
          alt: "宽幅卡织作品需要使用梭子",
          altEn: "Wide card weaving work requiring a shuttle",
        },
      ],
    },

    // ── Lesson 2：辅具介绍 - 取线工具 ────────────────────────────
    {
      index: 2,
      title: "辅具介绍 - 取线工具",
      titleEn: "Accessories - Yarn Tensioning Setup",
      contentBlocks: [
        {
          type: "heading",
          level: 3,
          content: "取线工具",
          contentEn: "Yarn Tensioning Tools",
        },
        {
          type: "image",
          src: "/images/courses/course1/取线工具-2.jpeg",
          alt: "取线工具架设示意图（Chain tie 方式）",
          altEn: "Yarn tensioning setup diagram (Chain tie method)",
        },
        {
          type: "text",
          content: "在教程中使用的取线工具为两个桌面固定夹（F夹），这个方法适用于长度较短的作品，2m以内较合适。一般日常制作的包带、腰带等都已经完全够用啦。",
          contentEn: "This tutorial uses two desk clamps (F-clamps) for yarn tensioning, suitable for pieces up to 2 meters long — more than sufficient for everyday items like bag straps and belts.",
        },
        {
          type: "image",
          src: "/images/courses/course1/取线工具-1.jpeg",
          alt: "F夹实物固定效果",
          altEn: "F-clamp setup in practice",
        },
      ],
    },

    // ── Lesson 3：辅具介绍 - 固定线材工具 ────────────────────────
    {
      index: 3,
      title: "辅具介绍 - 固定线材工具",
      titleEn: "Accessories - Securing the Warp",
      contentBlocks: [
        {
          type: "heading",
          level: 3,
          content: "固定线材工具",
          contentEn: "Warp Securing Tools",
        },
        {
          type: "text",
          content: "如果看过我知乎专栏的文章，肯定知道卡织的编织工具其实很多。在基础教程中我们使用的是零成本、一头与腰带固定、一头与F夹固定的编织方式。家里的皮带、腰带、织带都可以拿来使用。F夹也可以替换成柜子把手、椅背等。",
          contentEn: "The beginner course uses a zero-cost method: one end of the warp tied to a belt worn around your waist, the other attached to an F-clamp. Any belt, strap, or handle at home can work as an anchor.",
        },
        {
          type: "callout",
          style: "tip",
          content: "TIPS：如果跟我一样腰椎不太好的人，建议使用2.5cm以上宽度的织带，并固定在骶骨而非腰椎的位置，这样即使长时间编织也不易产生不适。",
          contentEn: "TIP: If you have lower back issues, use a waistband wider than 2.5cm and position it at the sacrum rather than the lumbar spine to avoid discomfort during long weaving sessions.",
        },
        {
          type: "image",
          src: "/images/courses/course1/固定线材工具-1.jpeg",
          alt: "腰带固定线材示例",
          altEn: "Warp secured to waist belt",
        },
        {
          type: "image",
          src: "/images/courses/course1/固定线材工具-3.jpeg",
          alt: "柜子把手固定示例",
          altEn: "Warp secured to cabinet handle",
        },
        {
          type: "image",
          src: "/images/courses/course1/固定线材工具-2.png",
          alt: "固定线材工具图示",
          altEn: "Warp securing diagram",
        },
        {
          type: "callout",
          style: "info",
          content: "知乎专栏：https://zhuanlan.zhihu.com/p/89620389",
          contentEn: "Zhihu column: https://zhuanlan.zhihu.com/p/89620389",
        },
      ],
    },

    // ── Lesson 4：线材介绍 ─────────────────────────────────────────
    {
      index: 4,
      title: "线材介绍",
      titleEn: "Yarn Introduction",
      contentBlocks: [
        {
          type: "text",
          content: "这个可能是大家最常问，也最感兴趣的问题了。我的回答常常是「其实什么线材都可以」。但你首先要了解每个纤维具有的特性，才能懂得如何选择。",
          contentEn: "This is probably the most frequently asked question. My usual answer is: almost any yarn can work. But you first need to understand the properties of each fiber to make informed choices.",
        },
        {
          type: "text",
          content: "在卡织课程的材料包里我选择了纯棉、亚麻这两种材质，我个人比较偏好天然材料。羊毛线比较娇贵，价格贵、易断、易起球等毛病还挺多的，大家可以熟练了之后再做尝试。",
          contentEn: "The course kit includes pure cotton and linen — I prefer natural materials. Wool is delicate, expensive, and prone to breaking and pilling; save it until you're more experienced.",
        },
        {
          type: "image",
          src: "/images/courses/course1/线材介绍.png",
          alt: "各色卡织织带成品展示",
          altEn: "Finished card weaving bands in various colors",
        },
        {
          type: "callout",
          style: "info",
          content: "线材详细介绍专栏：https://zhuanlan.zhihu.com/p/43225242",
          contentEn: "Detailed yarn guide: https://zhuanlan.zhihu.com/p/43225242",
        },
        {
          type: "heading",
          level: 3,
          content: "纺线方式",
          contentEn: "Yarn Spinning Method",
        },
        {
          type: "text",
          content: "线材选择的另一个因素是纺线的方式。在纺织工业中，「纱」是将许多短纤维或长丝排列成近似平行状态，并沿轴向旋转加捻，组成具有一定强力和线密度的细长物体；而「线」是由两根或两根以上的单纱捻合而成的股线。简单来说，纺线一般需要2步：先捻后合股。捻度越强、合股数量越多，线材就会越强韧。",
          contentEn: "Another factor is how the yarn is spun. In textile terms, 'yarn' is formed by twisting fibers together, while 'thread' is made by twisting two or more yarns together. In short, yarn is made in two steps: twist then ply. The stronger the twist and the more plies, the stronger the yarn.",
        },
        {
          type: "text",
          content: "一开始做卡织，最好选择强度高的线，比如棉质或亚麻的蕾丝线。",
          contentEn: "When starting out with card weaving, choose high-strength yarns such as cotton or linen lace thread.",
        },
        {
          type: "image",
          src: "/images/courses/course1/线材介绍.jpeg",
          alt: "纺线机示意图",
          altEn: "Yarn spinning machine",
        },
        {
          type: "heading",
          level: 3,
          content: "线材粗细",
          contentEn: "Yarn Thickness",
        },
        {
          type: "text",
          content: "课程中使用的基本上都是8号蕾丝线（0.5-0.7mm左右，不同品牌之间会有一点差别），比较适合用来制作2cm以下宽幅的织带。",
          contentEn: "The course uses #8 lace thread (approximately 0.5-0.7mm, with slight variation between brands), ideal for bands up to 2cm wide.",
        },
        {
          type: "list",
          ordered: false,
          items: [
            { content: "钥匙圈织带宽度 2cm，使用 24 张卡片", contentEn: "Keyring strap 2cm wide — 24 cards" },
            { content: "宠物项圈宽度 1.5cm，使用 18-20 张卡片", contentEn: "Pet collar 1.5cm wide — 18–20 cards" },
            { content: "手链宽度 0.8cm，使用 10 张卡片", contentEn: "Bracelet 0.8cm wide — 10 cards" },
          ],
        },
        {
          type: "text",
          content: "如果换成更粗的线材（比如1mm），那织物的宽度就会翻倍。越细的线材编织出来的纹理越细腻，当然也越费时；粗线制作起来速度比较快，厚度也会增加。所以需要根据自己制作的物件来选择线材，这会需要一点时间和经验。",
          contentEn: "Thicker thread (e.g. 1mm) doubles the band width. Finer thread creates more delicate textures but takes longer; thicker thread is faster and produces a thicker band. Choose based on your project — this takes a bit of time and experience to get right.",
        },
      ],
    },

    // ── Lesson 5：理论知识补充 - S/Z 穿线方向 ────────────────────
    {
      index: 5,
      title: "理论知识补充 - S/Z 穿线方向",
      titleEn: "Theory - S/Z Threading Direction",
      contentBlocks: [
        {
          type: "text",
          content: "视频教程里详细讲解了S/Z的穿线方向，有时候也会遇到用斜杠来表示S/Z的图解。其实非常好记——你想象字母Z的上下两根横杠都去掉，就得到了「/」这个方向的斜杠，那反方向的就是S啦。",
          contentEn: "The video explains S/Z threading in detail. In diagrams, threading direction is shown with a slash. It's easy to remember: remove the top and bottom bars of the letter 'Z' and you get '/' — that's Z-direction; the reverse is S.",
        },
        {
          type: "text",
          content: "右图几个图解也是卡织中经典又简单的图形，大家也可以自己尝试制作～",
          contentEn: "The diagrams below show classic and simple card weaving patterns — try making them yourself!",
        },
        {
          type: "image",
          src: "/images/courses/course1/S-Z穿线方向说明.png",
          alt: "S/Z穿线方向说明与经典图案图解",
          altEn: "S/Z threading direction explanation and classic pattern diagrams",
        },
      ],
    },

    // ── Lesson 6：理论知识视频 ────────────────────────────────────
    {
      index: 6,
      title: "理论知识视频",
      titleEn: "Theory Video",
      contentBlocks: [
        {
          type: "video",
          platform: "oss",
          src: "https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/courses/course1/playlist.m3u8",
          thumbnail: "/images/courses/course1/理论知识视频.png",
          duration: "16:25",
          title: "卡织理论知识详解",
          titleEn: "Card Weaving Theory Explained",
        },
      ],
    },

    // ── Lesson 7：开始编织视频 ────────────────────────────────────
    {
      index: 7,
      title: "开始编织视频",
      titleEn: "Start Weaving Video",
      contentBlocks: [
        {
          type: "video",
          platform: "oss",
          src: "https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/courses/course1/playlist.m3u8",
          thumbnail: "/images/courses/course1/开始编织视频.jpeg",
          duration: "16:25",
          title: "开始编织 - 完整操作演示",
          titleEn: "Start Weaving - Full Demonstration",
        },
      ],
    },

    // ── Lesson 8：手链制作视频 ────────────────────────────────────
    {
      index: 8,
      title: "手链制作视频",
      titleEn: "Bracelet Making Video",
      contentBlocks: [
        {
          type: "video",
          platform: "oss",
          src: "https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/courses/course1/playlist.m3u8",
          thumbnail: "/images/courses/course1/手链制作视频.jpeg",
          duration: "16:25",
          title: "手链制作完整演示",
          titleEn: "Bracelet Making Full Demonstration",
        },
      ],
    },
  ],
}

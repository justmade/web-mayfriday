const coverImage = "/images/courses/course3/cover.jpg"
const img = (name) => `/images/courses/course3/${name}`
const videoBase = "https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/courses/course3"

// 新增课程视频后,必须同步登记 api/_video-access.js 的 COURSE_PLAYLISTS,
// 否则 /api/video-token 返回 404,视频播不了。
const video = (slug) => `${videoBase}/${slug}/playlist.m3u8`

export const course3Data = {
  id: "course3",
  title: "梭织手链课程",
  titleEn: "Woven Bracelet Course",
  description: "课程从 MINI LOOM / 织带机的整经与上机开始，系统学习一条手链从建立经纬结构到完成收尾的完整流程。内容涵盖起头与边缘控制、横向/竖向条纹图案、纬线接续、色块拼接及成品收尾等关键技法。",
  descriptionEn: "Starting from warping and setting up a MINILOOM or band loom, this course walks through the full process of building a bracelet — from establishing the warp and weft structure to finishing the piece. It covers starting and selvedge control, horizontal and vertical stripe patterns, joining the weft, color block transitions, and final finishing.",
  coverImage,
  difficulty: "beginner",
  difficultyEn: "Beginner",
  duration: "自定进度",
  durationEn: "Self-paced",
  introImages: [
    coverImage,
  ],

  // ── 落地页专属内容 ─────────────────────────────────────────────
  // 对应设计稿交接包:content/courses/course3/梭织手链网站_开发交接包/
  // 只有 course3 有 landing,CourseOverview 据此切换到专属版式。
  landing: {
    heroImage: coverImage,
    introImage: img("intro-bracelets.jpg"),

    // 课程介绍区:中文大标题 + Optima 斜体英文副标题
    heading: "艺术梭织手链课程",
    headingEn: "Art Weaving Bracelet Class",
    headingLatin: "art weaving bracelet class",
    intro: "通过课程，建立对梭织结构的基本理解，并在掌握基础技法后，通过调整配色、各种技法的自有组合，延伸出个人化的手链设计。",
    introEn:
      "This course builds a working understanding of woven structure. Once the fundamentals are in hand, you can adjust palettes and combine techniques freely to extend the work into bracelet designs of your own.",

    // 你将会学到:设计稿为 3 列 × 2 行,共 6 张卡片。
    // 注意这 6 项是技法要点,不是 5 节课的目录,两者不一一对应。
    learnPoints: [
      {
        image: img("learn-miniloom.jpg"),
        title: "MINILOOM整经",
        titleEn: "MINILOOM Warping",
        desc: "如何在编织板上绕双倍长度的经线，并保证边缘张力",
        descEn: "Winding a double-length warp on the weaving board while keeping the selvedge tension even",
      },
      {
        image: img("learn-bandloom.jpg"),
        title: "织带机整经",
        titleEn: "Band Loom Warping",
        desc: "织带机整经方法和宽度调整",
        descEn: "Warping on the band loom and adjusting the width",
      },
      {
        image: img("learn-start-weft.jpg"),
        title: "起头＆接纬线",
        titleEn: "Starting & Joining the Weft",
        desc: "调整手链宽度和经线分布；同色/异色纬线拼接方法",
        descEn: "Setting bracelet width and warp distribution; joining weft in matching or contrasting colors",
      },
      {
        image: img("learn-stripe.jpg"),
        title: "条纹编织技法",
        titleEn: "Stripe Weaving",
        desc: "",
        descEn: "",
      },
      {
        image: img("learn-color-block.jpg"),
        title: "色块拼接技法",
        titleEn: "Color Block Transitions",
        desc: "",
        descEn: "",
      },
      {
        image: img("learn-finishing.jpg"),
        title: "收尾＆配件安装",
        titleEn: "Finishing & Hardware",
        desc: "",
        descEn: "",
      },
    ],

    // 导师介绍:左侧 2:3 肖像 + 右侧文案
    instructor: {
      photo: img("instructor-xuying.jpg"),
      name: "徐颖",
      nameEn: "Xu Ying",
      role: "编织设计师 / MAYIN FRIDAY 主理人",
      roleEn: "Weaving designer / Founder of MAYIN FRIDAY",
      bio: [
        "2018年开始从事编织创作与研究，关注传统织带技法的研究与当代转化，涉及卡织、排织、萨米织带、侗族花带及挂毯等方向。曾赴侗族、畲族地区进行织带游学，并自主研发传统织带课程及专利编织工具。",
        "合作项目：Qeelin 麒麟、凡几市集、品牌定制织带项目、无早联名主题展等",
        "出版 / 收录：与 WeaveWave 工作室合作出版侗族图样手册，获 Wallpaper* 收录",
      ],
      bioEn: [
        "Working in weaving since 2018, with a practice centred on researching traditional band-weaving techniques and translating them into contemporary work — card weaving, rigid-heddle weaving, Sámi bands, Dong brocade bands and tapestry. Has travelled to Dong and She communities to study band weaving, and developed original courses and patented weaving tools.",
        "Collaborations: Qeelin, Fanji Market, custom band-weaving projects for brands, and a joint exhibition with Wuzao.",
        "Publications: co-published a Dong pattern handbook with WeaveWave Studio, featured in Wallpaper*.",
      ],
    },
  },

  lessons: [
    // ── Lesson 0：MINI LOOM上机 ─────────────────────────────────
    // slug 仍是 warping:OSS 上的对象路径不随标题改名,改名要重传整个
    // playlist 并同步 api/_video-access.js,没有必要。
    {
      index: 0,
      title: "MINI LOOM上机",
      titleEn: "MINI LOOM Setup",
      contentBlocks: [
        {
          type: "text",
          content: "从整经开始，建立一条手链的经线结构。本节演示 MINI LOOM 的上经方法，请准备好线材与织机，跟随视频操作。",
          contentEn: "Begin with warping to build the bracelet's warp structure. This lesson demonstrates setting up the MINI LOOM — prepare your yarn and loom and follow along.",
        },
        {
          type: "video",
          platform: "oss",
          src: video("warping"),
          thumbnail: coverImage,
          duration: "1:45",
          title: "MINI LOOM上机",
          titleEn: "MINI LOOM Setup",
        },
      ],
    },

    // ── Lesson 1：织带机上机 ────────────────────────────────────
    // slug 仍是 selvedge,原因同 Lesson 0。
    {
      index: 1,
      title: "织带机上机",
      titleEn: "Band Loom Setup",
      contentBlocks: [
        {
          type: "text",
          content: "织带机能织出更长、更稳定的带子。本节演示织带机的整经与上机方法，以及如何调整手链宽度。",
          contentEn: "A band loom lets you weave longer, more stable bands. This lesson demonstrates warping and setting up the band loom, and how to adjust the width of the bracelet.",
        },
        {
          type: "video",
          platform: "oss",
          src: video("selvedge"),
          thumbnail: coverImage,
          duration: "7:05",
          title: "织带机上机",
          titleEn: "Band Loom Setup",
        },
      ],
    },

    // ── Lesson 2：起头/平纹/条纹技法 ────────────────────────────
    // slug 仍是 weft-joining,原因同 Lesson 0。
    {
      index: 2,
      title: "起头/平纹/条纹技法",
      titleEn: "Starting, Plain Weave & Stripes",
      contentBlocks: [
        {
          type: "text",
          content: "本节是课程的主体。从起头的松紧与边缘张力讲起，进入平纹的基本节奏，再到横向、竖向条纹的编织方法，并演示同色/异色纬线的接续处理，让接口不显眼、不松脱。",
          contentEn: "This is the core lesson. It starts with tension at the beginning of the band and along the selvedge, moves into the rhythm of plain weave, then covers horizontal and vertical stripes — including how to join the weft in matching or contrasting colors so the transition stays invisible and secure.",
        },
        {
          type: "video",
          platform: "oss",
          src: video("weft-joining"),
          thumbnail: coverImage,
          duration: "19:02",
          title: "起头/平纹/条纹技法",
          titleEn: "Starting, Plain Weave & Stripes",
        },
      ],
    },

    // ── Lesson 3：色块拼接技法 ──────────────────────────────────
    {
      index: 3,
      title: "色块拼接技法",
      titleEn: "Color Block Transitions",
      contentBlocks: [
        {
          type: "text",
          content: "色块拼接决定手链的视觉层次。掌握本节技法后，可以自主调整配色、色块比例与排列方式，延伸出个人化的设计。",
          contentEn: "Color blocking shapes the visual rhythm of the bracelet. Once you have this technique, you can adjust palettes, block proportions, and arrangements to create your own designs.",
        },
        {
          type: "video",
          platform: "oss",
          src: video("color-block"),
          thumbnail: coverImage,
          duration: "13:39",
          title: "色块拼接技法",
          titleEn: "Color Block Transitions",
        },
      ],
    },

    // ── Lesson 4：收尾/配件安装 ─────────────────────────────────
    {
      index: 4,
      title: "收尾/配件安装",
      titleEn: "Finishing & Hardware",
      contentBlocks: [
        {
          type: "text",
          content: "下机后的收尾决定成品的完成度。本节演示手链的收尾处理与配件安装，完成一条可以直接佩戴的作品。",
          contentEn: "How you finish after taking the piece off the loom determines the quality of the result. This lesson covers finishing the ends and attaching the hardware, turning the band into a wearable bracelet.",
        },
        {
          type: "video",
          platform: "oss",
          src: video("finishing"),
          thumbnail: coverImage,
          duration: "4:15",
          title: "收尾/配件安装",
          titleEn: "Finishing & Hardware",
        },
      ],
    },
  ],
}

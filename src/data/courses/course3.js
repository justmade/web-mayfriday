const coverImage = "/images/courses/course3/cover.jpg"
const videoBase = "https://web-mayfriday-videos.oss-cn-beijing.aliyuncs.com/courses/course3"

// 新增课程视频后,必须同步登记 api/_video-access.js 的 COURSE_PLAYLISTS,
// 否则 /api/video-token 返回 404,视频播不了。
const video = (slug) => `${videoBase}/${slug}/playlist.m3u8`

export const course3Data = {
  id: "course3",
  title: "梭织手链课程",
  titleEn: "Woven Bracelet Course",
  description: "课程从 MINILOOM / 织带机的整经与上机开始，系统学习一条手链从建立经纬结构到完成收尾的完整流程。内容涵盖起头与边缘控制、横向/竖向条纹图案、纬线接续、色块拼接及成品收尾等关键技法。",
  descriptionEn: "Starting from warping and setting up a MINILOOM or band loom, this course walks through the full process of building a bracelet — from establishing the warp and weft structure to finishing the piece. It covers starting and selvedge control, horizontal and vertical stripe patterns, joining the weft, color block transitions, and final finishing.",
  coverImage,
  difficulty: "beginner",
  difficultyEn: "Beginner",
  duration: "自定进度",
  durationEn: "Self-paced",
  introImages: [
    coverImage,
  ],
  lessons: [
    // ── Lesson 0：MINILOOM / 织带机整经上机 ──────────────────────
    {
      index: 0,
      title: "MINILOOM / 织带机整经上机",
      titleEn: "Warping & Setup: MINILOOM / Band Loom",
      contentBlocks: [
        {
          type: "text",
          content: "从整经开始，建立一条手链的经线结构。本节演示 MINILOOM 的上经方法，请准备好线材与织机，跟随视频操作。",
          contentEn: "Begin with warping to build the bracelet's warp structure. This lesson demonstrates setting up the MINILOOM — prepare your yarn and loom and follow along.",
        },
        {
          type: "video",
          platform: "oss",
          src: video("warping"),
          thumbnail: coverImage,
          duration: "1:45",
          title: "MINILOOM 整经上机",
          titleEn: "MINILOOM Warping & Setup",
        },
      ],
    },

    // ── Lesson 1：起头与边缘控制｜条纹编织 ────────────────────────
    {
      index: 1,
      title: "起头与边缘控制｜条纹编织",
      titleEn: "Starting & Selvedge Control | Stripe Weaving",
      contentBlocks: [
        {
          type: "text",
          content: "起头的松紧和边缘张力决定成品是否平整。本节讲解织带机的上经方式，以及横向、竖向条纹图案的编织方法。",
          contentEn: "The tension at the start and along the selvedge determines whether the finished band lies flat. This lesson covers band loom setup and weaving horizontal and vertical stripe patterns.",
        },
        {
          type: "video",
          platform: "oss",
          src: video("selvedge"),
          thumbnail: coverImage,
          duration: "7:05",
          title: "起头与边缘控制｜条纹编织",
          titleEn: "Starting & Selvedge Control | Stripe Weaving",
        },
      ],
    },

    // ── Lesson 2：纬线接续 ───────────────────────────────────────
    {
      index: 2,
      title: "纬线接续",
      titleEn: "Joining the Weft",
      contentBlocks: [
        {
          type: "text",
          content: "换线和接线是梭织中最常遇到的问题。本节详细演示纬线接续的处理方式，让接口不显眼、不松脱。",
          contentEn: "Changing and joining yarn is the most common challenge in weaving. This lesson demonstrates how to join the weft so the transition stays invisible and secure.",
        },
        {
          type: "video",
          platform: "oss",
          src: video("weft-joining"),
          thumbnail: coverImage,
          duration: "19:02",
          title: "纬线接续",
          titleEn: "Joining the Weft",
        },
      ],
    },

    // ── Lesson 3：色块拼接 ───────────────────────────────────────
    {
      index: 3,
      title: "色块拼接",
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
          title: "色块拼接",
          titleEn: "Color Block Transitions",
        },
      ],
    },

    // ── Lesson 4：手链收尾 ───────────────────────────────────────
    {
      index: 4,
      title: "手链收尾",
      titleEn: "Finishing the Bracelet",
      contentBlocks: [
        {
          type: "text",
          content: "下机后的收尾决定成品的完成度。本节演示手链的收尾处理，完成一条可以直接佩戴的作品。",
          contentEn: "How you finish after taking the piece off the loom determines the quality of the result. This lesson demonstrates finishing the bracelet into a wearable piece.",
        },
        {
          type: "video",
          platform: "oss",
          src: video("finishing"),
          thumbnail: coverImage,
          duration: "4:15",
          title: "手链收尾",
          titleEn: "Finishing the Bracelet",
        },
      ],
    },
  ],
}

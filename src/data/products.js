export const products = [
  {
    id: "sami-heddle",
    name: "萨米提花编织板",
    nameEn: "Sámi Pattern Heddle",
    description: "适合萨米立体提花织带，板面经过细致打磨，附基础穿线说明。",
    descriptionEn: "A smooth-finished heddle for raised Sámi band patterns, supplied with a basic threading guide.",
    price: 168,
    image: "/images/courses/course2/第1页-1.jpeg",
    category: "looms",
    stock: 18,
    badge: "课程同款",
    badgeEn: "Course pick",
    options: [
      {
        id: "slots",
        name: "规格",
        nameEn: "Size",
        values: [
          { id: "sami9", name: "SAMI 9 槽", nameEn: "SAMI 9-slot", priceDelta: 0 },
          { id: "sigga16", name: "SIGGA 16 槽", nameEn: "SIGGA 16-slot", priceDelta: 48 },
        ],
      },
    ],
  },
  {
    id: "inkle-heddle",
    name: "排织入门编织板",
    nameEn: "Inkle Weaving Heddle",
    description: "适合零基础学习排织与窄幅织带，也是学习萨米提花前的推荐工具。",
    descriptionEn: "A beginner-friendly heddle for plain narrow bands and the recommended first step before Sámi patterns.",
    price: 98,
    image: "/images/courses/course2/第4页-1.jpeg",
    category: "looms",
    stock: 26,
    options: [
      {
        id: "width",
        name: "宽度",
        nameEn: "Width",
        values: [
          { id: "standard", name: "标准款", nameEn: "Standard", priceDelta: 0 },
          { id: "wide", name: "宽幅款", nameEn: "Wide", priceDelta: 36 },
        ],
      },
    ],
  },
  {
    id: "tablet-cards",
    name: "卡织卡片套装",
    nameEn: "Tablet Weaving Cards",
    description: "轻盈耐用的四孔卡片，边缘圆滑，适合卡织入门和日常练习。",
    descriptionEn: "Lightweight four-hole cards with smooth edges for tablet-weaving practice.",
    price: 48,
    image: "/images/courses/course1/工具介绍-卡片与梭子-2.png",
    category: "looms",
    stock: 40,
    options: [
      {
        id: "quantity",
        name: "数量",
        nameEn: "Quantity",
        values: [
          { id: "12", name: "12 张", nameEn: "12 cards", priceDelta: 0 },
          { id: "24", name: "24 张", nameEn: "24 cards", priceDelta: 38 },
          { id: "36", name: "36 张", nameEn: "36 cards", priceDelta: 68 },
        ],
      },
    ],
  },
  {
    id: "wood-shuttle",
    name: "木质织带梭子",
    nameEn: "Wooden Band Shuttle",
    description: "用于储存纬线和打紧织口，适合排织、萨米织带与卡织。",
    descriptionEn: "Carries the weft and beats the shed for Inkle, Sámi, and tablet weaving.",
    price: 58,
    image: "/images/courses/course1/工具介绍-卡片与梭子-1.jpeg",
    category: "tools",
    stock: 32,
    options: [
      {
        id: "length",
        name: "长度",
        nameEn: "Length",
        values: [
          { id: "small", name: "小号 18cm", nameEn: "Small 18cm", priceDelta: 0 },
          { id: "large", name: "大号 25cm", nameEn: "Large 25cm", priceDelta: 20 },
        ],
      },
    ],
  },
  {
    id: "weaving-holder",
    name: "桌面编织固定器",
    nameEn: "Desktop Weaving Holder",
    description: "稳定固定经线，帮助保持均匀张力，适合桌面编织和长时间练习。",
    descriptionEn: "Anchors the warp and maintains even tension for comfortable tabletop weaving.",
    price: 198,
    image: "/images/courses/course2/第5页-1.jpeg",
    category: "tools",
    stock: 12,
    badge: "推荐",
    badgeEn: "Recommended",
    options: [
      {
        id: "bundle",
        name: "套装",
        nameEn: "Bundle",
        values: [
          { id: "holder", name: "固定器单件", nameEn: "Holder only", priceDelta: 0 },
          { id: "holder-belt", name: "固定器 + 腰带", nameEn: "Holder + belt", priceDelta: 68 },
        ],
      },
    ],
  },
  {
    id: "sami-starter-kit",
    name: "萨米织带零基础工具包",
    nameEn: "Sámi Band Starter Kit",
    description: "包含萨米编织板、木梭、钩针和练习线材，可配合萨米织带课程使用。",
    descriptionEn: "Includes a Sámi heddle, wooden shuttle, hook, and practice yarn for the Sámi band course.",
    price: 298,
    image: "/images/courses/course2/第6页-1.jpeg",
    category: "kits",
    stock: 10,
    badge: "完整套装",
    badgeEn: "Complete kit",
    options: [
      {
        id: "color",
        name: "练习线配色",
        nameEn: "Practice yarn colors",
        values: [
          { id: "classic", name: "经典红蓝", nameEn: "Classic red & blue", priceDelta: 0 },
          { id: "natural", name: "自然米棕", nameEn: "Natural cream & brown", priceDelta: 0 },
          { id: "custom", name: "自选配色", nameEn: "Custom colors", priceDelta: 28 },
        ],
      },
    ],
  },
]

export const categories = [
  { id: "all", name: "全部工具", nameEn: "All tools" },
  { id: "looms", name: "编织板与卡片", nameEn: "Heddles & cards" },
  { id: "tools", name: "辅助工具", nameEn: "Accessories" },
  { id: "kits", name: "入门套装", nameEn: "Starter kits" },
]

export function getConfiguredPrice(product, selections = {}) {
  return (product.options || []).reduce((total, option) => {
    const selectedId = selections[option.id] || option.values[0]?.id
    const selected = option.values.find((value) => value.id === selectedId)
    return total + (selected?.priceDelta || 0)
  }, product.price)
}

export function getDefaultSelections(product) {
  return Object.fromEntries((product.options || []).map((option) => [option.id, option.values[0]?.id]))
}

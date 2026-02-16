import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  zh: {
    translation: {
      nav: {
        home: '首页',
        courses: '课程',
        patterns: '图案',
        tools: '工具',
        resources: '资源',
        membership: '会员',
        gallery: '作品集',
      },
      home: {
        hero: {
          title: '五月的星期五手工坊',
          subtitle: '传统编织艺术，现代生活美学',
          cta: '探索更多',
        },
        featured: {
          title: '精选课程',
          viewAll: '查看全部课程',
        },
        about: {
          title: '关于工作室',
          description: '我们致力于传承和推广传统编织技艺，让每一件手工作品都充满温度与故事。',
          learnMore: '了解更多',
        },
        recent: {
          title: '近期作品',
          viewGallery: '查看作品集',
        },
      },
      courses: {
        title: '编织课程',
        subtitle: '从基础到进阶，系统学习编织技艺',
        difficulty: {
          beginner: '初级',
          intermediate: '中级',
          advanced: '高级',
        },
        duration: '课时',
        price: '价格',
        enroll: '报名',
      },
      tools: {
        title: '编织工具',
        subtitle: '精选优质编织工具和材料',
        addToCart: '加入购物车',
        cart: '购物车',
        total: '总计',
        checkout: '结算',
        emptyCart: '购物车为空',
        remove: '移除',
        quantity: '数量',
        categories: {
          all: '全部',
          needles: '编织针',
          yarn: '毛线',
          accessories: '配件',
        },
      },
      studio: {
        title: '工作室介绍',
        story: {
          title: '我们的故事',
          content: '五月的星期五手工坊创立于2020年，源于对传统编织艺术的热爱。我们相信，每一件手工作品都承载着创作者的情感和故事。在这里，我们不仅教授编织技艺，更希望传递慢生活的美学理念。',
        },
        philosophy: {
          title: '理念',
          content: '传承传统工艺，融合现代设计，让编织艺术走进日常生活。',
        },
        contact: {
          title: '联系我们',
          email: '邮箱',
          phone: '电话',
          address: '地址',
        },
      },
      gallery: {
        title: '作品集',
        subtitle: '欣赏我们的手工编织作品',
        categories: {
          all: '全部',
          scarves: '围巾',
          bags: '包袋',
          home: '家居',
          accessories: '配饰',
        },
      },
      common: {
        learnMore: '了解更多',
        viewDetails: '查看详情',
        close: '关闭',
        prev: '上一个',
        next: '下一个',
        loading: '加载中...',
        yuan: '元',
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        courses: 'Courses',
        patterns: 'Patterns',
        tools: 'Tools',
        resources: 'Resources',
        membership: 'Membership',
        gallery: 'Gallery',
      },
      home: {
        hero: {
          title: 'May Friday Handicraft Studio',
          subtitle: 'Traditional Weaving Art, Modern Living Aesthetics',
          cta: 'Explore More',
        },
        featured: {
          title: 'Featured Courses',
          viewAll: 'View All Courses',
        },
        about: {
          title: 'About Studio',
          description: 'We are dedicated to preserving and promoting traditional weaving techniques, making every handmade piece filled with warmth and stories.',
          learnMore: 'Learn More',
        },
        recent: {
          title: 'Recent Works',
          viewGallery: 'View Gallery',
        },
      },
      courses: {
        title: 'Weaving Courses',
        subtitle: 'Learn weaving from basics to advanced',
        difficulty: {
          beginner: 'Beginner',
          intermediate: 'Intermediate',
          advanced: 'Advanced',
        },
        duration: 'Duration',
        price: 'Price',
        enroll: 'Enroll',
      },
      tools: {
        title: 'Weaving Tools',
        subtitle: 'Premium weaving tools and materials',
        addToCart: 'Add to Cart',
        cart: 'Cart',
        total: 'Total',
        checkout: 'Checkout',
        emptyCart: 'Your cart is empty',
        remove: 'Remove',
        quantity: 'Quantity',
        categories: {
          all: 'All',
          needles: 'Needles',
          yarn: 'Yarn',
          accessories: 'Accessories',
        },
      },
      studio: {
        title: 'About Studio',
        story: {
          title: 'Our Story',
          content: 'May Friday Handicraft Studio was founded in 2020, born from a passion for traditional weaving arts. We believe every handmade piece carries the emotions and stories of its creator. Here, we not only teach weaving techniques but also hope to convey the aesthetics of slow living.',
        },
        philosophy: {
          title: 'Philosophy',
          content: 'Preserving traditional crafts, integrating modern design, bringing weaving art into daily life.',
        },
        contact: {
          title: 'Contact Us',
          email: 'Email',
          phone: 'Phone',
          address: 'Address',
        },
      },
      gallery: {
        title: 'Gallery',
        subtitle: 'Explore our handmade weaving works',
        categories: {
          all: 'All',
          scarves: 'Scarves',
          bags: 'Bags',
          home: 'Home',
          accessories: 'Accessories',
        },
      },
      common: {
        learnMore: 'Learn More',
        viewDetails: 'View Details',
        close: 'Close',
        prev: 'Previous',
        next: 'Next',
        loading: 'Loading...',
        yuan: 'CNY',
      },
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

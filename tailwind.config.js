/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#cc007b',        // Vibrant pink/magenta
        secondary: '#37a8b7',      // Teal/cyan
        accent: '#b8d64d',         // Yellow-green
        gold: '#ffd200',           // Bright yellow
        cream: '#ebe9e6',          // Warm beige background
        'light-gray': '#e2e7ed',   // Light grayish blue
        'soft-pink': 'rgba(204, 0, 123, 0.1)',  // Soft pink background
        // 梭织手链落地页设计稿配色(交接包 §3)
        ink: '#231916',            // 主文字 / 按钮背景 / 分隔线
        'ink-strong': '#010101',   // 卡片标题与小字
      },
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        heading: ['Songti SC', 'STSong', 'Noto Serif SC', 'Georgia', 'serif'],
        // 设计稿字体栈(交接包 §4)。Hiragino / Optima 非全平台自带,靠 fallback 退化。
        cn: ['Hiragino Sans GB', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        optima: ['Optima', 'Optima LT Std', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'hover': '0 4px 25px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}

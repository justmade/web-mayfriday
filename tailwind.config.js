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
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
        heading: ['Noto Serif SC', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'hover': '0 4px 25px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}

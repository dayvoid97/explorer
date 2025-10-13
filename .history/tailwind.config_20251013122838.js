// tailwind.config.js
const plugin = require('@tailwindcss/line-clamp')
const typography = require('@tailwindcss/typography')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
    },
  },
  plugins: [lineClamp, typography], // 👈 include both plugins
}

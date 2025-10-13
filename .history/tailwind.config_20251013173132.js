// tailwind.config.js
const lineClamp = require('@tailwindcss/line-clamp')
const typography = require('@tailwindcss/typography')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
    },
  },
  plugins: [lineClamp, typography],
}

// tailwind.config.js
const plugin = require('@tailwindcss/line-clamp')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [plugin], // 👈 add here
}

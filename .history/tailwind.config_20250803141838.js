// tailwind.config.js
const plugin = require('@tailwindcss/line-clamp')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 4s linear infinite',
        'spin-fast': 'spin 2s linear infinite', // Add this for faster hover spin
      },
    },
  },
  plugins: [plugin], // 👈 add here
}

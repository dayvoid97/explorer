// tailwind.config.js
const plugin = require('@tailwindcss/line-clamp')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      theme: {
        extend: {
          animation: {
            'gradient-ring': 'rotateRing 5s linear infinite',
          },
          keyframes: {
            rotateRing: {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          },
        },
      },
    },
  },
  plugins: [plugin], // 👈 add here
}

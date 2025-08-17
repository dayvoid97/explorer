// tailwind.config.js
const plugin = require('@tailwindcss/line-clamp')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      theme: {
        extend: {
          animation: {
            'spin-slow': 'spin 6s linear infinite',
          },
        },
      },
    },
  },
  plugins: [plugin], // 👈 add here
}

// tailwind.config.js
const plugin = require('@tailwindcss/line-clamp')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      theme: {
        extend: {
          animation: {
            'rotate-border': 'spin 3s linear infinite',
          },
        },
      },
    },
  },
  plugins: [plugin], // 👈 add here
}

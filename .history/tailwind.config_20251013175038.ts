import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
    },
  },
  plugins: [typography],
} satisfies Config
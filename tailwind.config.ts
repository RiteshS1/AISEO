import type { Config } from 'tailwindcss'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tailwindcssAnimate = require('tailwindcss-animate')

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './App.tsx',
    './*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617',
        },
        lime: {
          400: '#a3e635', // Match zip-code Vite app (Tailwind default)
          500: '#84cc16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // CRITICAL: Restore the massive headline sizes
      fontSize: {
        '10xl': ['9rem', { lineHeight: '1' }],
        '11xl': ['11rem', { lineHeight: '1' }],
        xxs: '0.625rem', // 10px for the "by GetNifty" tag
      },
      // CRITICAL: Restore the exact shadow for the Audit Box
      boxShadow: {
        neon: '0 0 120px -20px rgba(217, 255, 0, 0.3)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
export default config

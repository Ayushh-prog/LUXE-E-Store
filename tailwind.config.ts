import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7f5',
          100: '#e3ece6',
          200: '#c6d9cd',
          300: '#9ebeab',
          400: '#709d84',
          500: '#4f8167',
          600: '#3c6650',
          700: '#325242',
          800: '#2a4337',
          900: '#23382e',
          950: '#121f19',
        },
        impact: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        editorial: {
          bg: '#0f1412',
          card: '#161c19',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#e2f1e7',
          muted: '#8e9b94'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;

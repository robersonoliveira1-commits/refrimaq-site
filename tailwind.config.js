/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0D1014',
          900: '#111418',
          800: '#1B2027',
          700: '#2A313B',
          600: '#495260',
          500: '#646F7F',
          400: '#8A94A3',
          200: '#E2E6EC',
          100: '#F1F3F6',
          50: '#F6F7F9',
        },
        brand: {
          700: '#083B75',
          600: '#094488',
          500: '#0B4F9C',
          100: '#E6EFF9',
          50: '#F2F6FC',
        },
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

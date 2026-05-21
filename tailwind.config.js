/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0b',
        surface: '#18181b',
        surface2: '#232327',
        border: '#2a2a2e',
        accent: '#C9A961',
        'accent-soft': '#A88B47',
        text: '#F5F3EE',
        muted: '#9b9aa0',
        good: '#5fb37c',
        warn: '#d7b261',
        bad: '#d96d6d',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}

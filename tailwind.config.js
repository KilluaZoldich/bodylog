/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Background base (warm dark, not pure black)
        ink: {
          950: '#08080a',
          900: '#0c0a09',
          800: '#141214',
          700: '#1a181b',
        },
        // Accents
        accent: {
          DEFAULT: '#C9A961',
          soft: '#A88B47',
          glow: '#E8C982',
        },
        // Foreground
        cream: '#F5F3EE',
        muted: '#9b9aa0',
        faint: '#5a585e',
        good: '#7fb893',
        warn: '#d7b261',
        bad: '#d96d6d',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '"SF Pro Display"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        // Squircle-friendly continuous-feel radii
        'glass-lg': '28px',
        'glass': '22px',
        'glass-sm': '16px',
        'glass-xs': '12px',
      },
      boxShadow: {
        // Inner top highlight + outer depth — the "specular" liquid glass effect
        'glass': 'inset 0 1px 0 0 rgba(255,255,255,0.12), 0 8px 32px -8px rgba(0,0,0,0.5)',
        'glass-lg': 'inset 0 1px 0 0 rgba(255,255,255,0.14), 0 20px 60px -12px rgba(0,0,0,0.7)',
        'glow-accent': '0 0 24px -4px rgba(201,169,97,0.5)',
      },
      letterSpacing: {
        editorial: '0.22em',
      },
      backdropBlur: {
        '3xl': '40px',
      },
    },
  },
  plugins: [],
}

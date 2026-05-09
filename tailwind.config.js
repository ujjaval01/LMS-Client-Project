/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: 'var(--color-bg)',
          lighter: 'var(--color-bg-lighter)',
          lightest: 'var(--color-bg-lightest)'
        },
        slate: {
          100: 'var(--color-slate-100)',
          200: 'var(--color-slate-200)',
          300: 'var(--color-slate-300)',
          400: 'var(--color-slate-400)',
          500: 'var(--color-slate-500)',
          800: 'var(--color-slate-800)',
        },
        brand: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          accent: '#06b6d4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' },
          '50%': { opacity: .5, boxShadow: '0 0 5px rgba(59, 130, 246, 0.2)' },
        }
      }
    },
  },
  plugins: [],
}

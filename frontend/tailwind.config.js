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
        health: {
          50: '#f1f5ee',
          100: '#e3ebdd',
          200: '#cbdcc3',
          300: '#acc5a3',
          400: '#85a880',
          500: '#648b62',
          600: '#476f4d',
          700: '#36583e',
          800: '#2d4835',
          900: '#263c2e',
          950: '#15231a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        surface: {
          light: '#ffffff',
          'light-subtle': '#f8fafc',
          dark: '#0f172a',
          'dark-card': '#1e293b',
          'dark-subtle': '#334155',
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'health-glow': '0 0 20px -5px rgba(20, 184, 166, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

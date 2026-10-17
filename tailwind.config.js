/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./script.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: { DEFAULT: '#0F172A', light: '#1E293B' },
        offwhite: '#F8FAFC',
        charcoal: '#334155',
        border: '#E2E8F0',
        amber: { DEFAULT: '#D97706', hover: '#B45309', light: '#FEF3C7' },
        emerald: { DEFAULT: '#059669', hover: '#047857', light: '#D1FAE5' },
      },
    },
  },
  plugins: [],
}

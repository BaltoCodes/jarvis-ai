/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        waveScroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'wave-move': 'waveScroll 10s linear infinite',
      },
    },
  },
  plugins: [],
}

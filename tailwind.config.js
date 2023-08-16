/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        default: 'Roboto',
      },

      colors: {
        'blue-500': 'rgba(33,24,200,1)',
        'purple-500': 'rgba(113,18,195,1)',
      },
    },
  },
  plugins: [],
}

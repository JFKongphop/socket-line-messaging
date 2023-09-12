/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-base': 'rgb(4, 54, 115)',
        'gray-base': '#707070',
        'red-base': '#F90053',
        'yellow-base': '#FFB800',
        'green-base': '#11BF76'
      }
    },
  },
  plugins: [],
}


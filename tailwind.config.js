/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Quicksand', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

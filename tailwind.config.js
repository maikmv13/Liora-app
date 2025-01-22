/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Quicksand', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        'slide-cart': {
          '0%': { transform: 'translateX(-200%)' },
          '100%': { transform: 'translateX(0)' }
        },
        explode: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.5' },
          '100%': { transform: 'scale(0)', opacity: '0' }
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        shimmer: 'shimmer 3s ease-in-out infinite',
        'slide-cart': 'slide-cart 1s ease-in-out',
        explode: 'explode 0.5s ease-out forwards'
      }
    },
  },
  plugins: [],
};
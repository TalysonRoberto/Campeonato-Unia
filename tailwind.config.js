/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        valorant: {
          red: '#FF4655',
          'red-light': '#FF6B76',
          dark: '#0F1419',
          darker: '#090C10',
          purple: '#BD3944',
          blue: '#0AC8B9'
        }
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gold: '#E3AC65',
        navbarItemGold: '#F9D68966',
        iconRed: '#994A4A',
        coral: '#994A4A',
        sand: '#F5E7B2',
        fontBrown: '#5A4A32',
        fontLightBrown: '#8a7658',
        bgRed: '#D37676',
        specialGreen: '#82A671',
        peach: '#F9D689',
      },
      fontFamily: {
        cinzel: ['"Cinzel Decorative"', 'serif'],
        playfair: ['"Playfair Display"', ],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

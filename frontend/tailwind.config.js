const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      spotify: '#1db954',
      spotifyAlt: '#1ed760',
      spotifyBlack: '#191414',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      red: colors.red
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

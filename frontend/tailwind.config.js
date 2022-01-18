const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        spotify: '#1db954',
        spotifyAlt: '#1ed760',
        spotifyBlack: '#191414',
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        red: colors.red,
        pink: '#f72585',
        byzantine: '#b5179e',
        purple: '#7209b7',
        purple2: '#560bad',
        trypanBlue: '#480ca8',
        trypanBlue2: '#3a0ca3',
        persianBlue: '#3f37c9',
        ultramarineBlue: '#4361ee',
        dodgerBlue: '#4895ef',
        skyBlue: '#4cc9f0'
      },
      fontSize: {
        'tiny': '.65rem',
      },
      scale: {
        '175': '1.75',
        '200': '2',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

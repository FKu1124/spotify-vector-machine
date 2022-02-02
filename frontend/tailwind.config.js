const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        deepBlue: '#001220',
        orangeKey: '#C62368',
        // https://coolors.co/d8f3dc-b7e4c7-95d5b2-74c69d-52b788-40916c-2d6a4f-1b4332-081c15
        deepRed: '#210000',
        green1: '#d8f3dc',
        green2: '#b7e4c7',
        green3: '#95d5b2',
        green4: '#74c69d',
        green5: '#52b788',
        green6: '#40916c',
        green7: '#2d6a4f',
        green8: '#1b4332',
        green9: '#081c15',
        spotify: '#1DB954'
      },
      fontSize: {
        'tiny': '.65rem',
      },
      scale: {
        '175': '1.75',
        '200': '2',
      },
      backgroundImage: {
        'bg_main': "url('/static/bg_main.svg')" 
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
  purge: {
    enabled: true,
    content: ['./src/tpl/**/*.njk'],
  },
  theme: {
    extend: {
      screens: {
        '2xl': '1440px',
        '3xl': '1920px',
      },
      colors: {
        'brand-primary': '#4BCDEB',
        'brand-secondary': '#0B1113',
      },
    },
  },
  variants: {},
  plugins: [],
}

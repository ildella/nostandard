const self = require('./')
const started = self({})
module.exports = [
  ...started,
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        test: 'readonly',
        expect: 'readonly',
      },
    },
  },
]

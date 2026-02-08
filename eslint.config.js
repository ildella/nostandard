const nostandard = require('./')

module.exports = [
  ...nostandard.configs.recommended,
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

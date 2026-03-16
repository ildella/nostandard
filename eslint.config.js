import {nostandard} from './src/index.js'

export default [
  ...nostandard.recommended,
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

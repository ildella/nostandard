import playwright from 'eslint-plugin-playwright'

export default {
  name: 'nostandard/playwright',
  files: ['e2e/**/*.*js'],
  ...playwright.configs['flat/recommended'],
}

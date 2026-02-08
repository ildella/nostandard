const vitest = require('@vitest/eslint-plugin')

module.exports = {
  name: 'nostandard/vitest',
  files: ['tests/**/*.js', '**/*.test.js'],
  plugins: {vitest},
  languageOptions: {
    globals: vitest.configs.env.languageOptions.globals,
  },
  rules: {
    ...vitest.configs.recommended.rules,
    'vitest/prefer-expect-resolves': 'warn',
    'vitest/no-commented-out-tests': 'warn',
    'vitest/max-nested-describe': ['error', {max: 1}],
    'vitest/no-conditional-expect': [
      'error',
      {expectAssertions: true},
    ],
    'no-undefined': 'off',
  },
}

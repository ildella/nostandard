import unicorn from 'eslint-plugin-unicorn'

const rules = {
  ...unicorn.configs.recommended.rules,
  'unicorn/import-style': 'off',
  'unicorn/no-array-reverse': 'warn',
  'unicorn/no-array-for-each': 'off',
  'unicorn/no-array-reduce': 'off',
  'unicorn/no-for-loop': 'warn',
  'unicorn/no-null': 'warn',
  'unicorn/numeric-separators-style': 'off',
  'unicorn/prefer-node-protocol': 'warn',
  'unicorn/prefer-single-call': 'off',
  'unicorn/prefer-spread': 'warn',
  'unicorn/name-replacements': 'warn',
  'unicorn/prefer-query-selector': 'off',
  'unicorn/no-array-callback-reference': 'off',
  'unicorn/prefer-export-from': 'warn',
}

export default {
  name: 'nostandard/unicorn',
  plugins: {unicorn},
  rules,
}

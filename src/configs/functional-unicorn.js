import functional from 'eslint-plugin-functional'
import unicorn from 'eslint-plugin-unicorn'

const rules = {
  ...functional.configs.recommended.rules,
  ...functional.configs.disableTypeChecked.rules,
  ...unicorn.configs.recommended.rules,
  'functional/no-let': 'warn',
  'functional/no-loop-statements': 'off',
  'functional/no-this-expressions': 'warn',
  'functional/no-try-statements': 'off',
  'import-x/no-nodejs-modules': 'error',
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
  'unicorn/prevent-abbreviations': ['warn',
    {
      checkFilenames: false,
      allowList: {
        args: true,
        Args: true,
        db: true,
        Db: true,
        dir: true,
        Dir: true,
      },
    }],
  'unicorn/prefer-query-selector': 'off',
  'unicorn/no-array-callback-reference': 'off',
  'unicorn/prefer-export-from': 'warn',
}

export default [
  {
    name: 'nostandard/functional-unicorn/plugins',
    plugins: {
      functional,
      unicorn,
    },
  },
  {
    name: 'nostandard/functional-unicorn/rules',
    files: ['src/**/*.js'],
    rules,
  },
]

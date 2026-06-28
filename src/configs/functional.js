import functional from 'eslint-plugin-functional'

const rules = {
  ...functional.configs.recommended.rules,
  ...functional.configs.disableTypeChecked.rules,
  'functional/no-let': 'warn',
  'functional/no-loop-statements': 'off',
  'functional/no-this-expressions': 'warn',
  'functional/no-try-statements': 'off',
}

export default {
  name: 'nostandard/functional',
  plugins: {functional},
  rules,
}

import functional from 'eslint-plugin-functional'
import {plugin} from '../rules/index.js'

const rules = {
  ...functional.configs.recommended.rules,
  ...functional.configs.disableTypeChecked.rules,
  'functional/no-let': 'warn',
  'functional/no-loop-statements': 'off',
  'functional/no-this-expressions': 'warn',
  'functional/no-try-statements': 'off',
  'no-param-reassign': ['warn', {props: true}],
  'nostandard/no-empty-sentinel': 'warn',
}

export default {
  name: 'nostandard/functional',
  plugins: {functional, nostandard: plugin},
  rules,
}

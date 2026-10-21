import {maxDestructuredProperties} from './max-destructured-properties.js'
import {noDynamicImport} from './no-dynamic-import.js'
import {restrictedSyntax} from './restricted-syntax.js'

export const plugin = {
  meta: {
    name: 'eslint-nostandard',
  },

  rules: {
    'max-destructured-properties': maxDestructuredProperties,
    'no-dynamic-import': noDynamicImport,
    'restricted-syntax': restrictedSyntax,
  },
}

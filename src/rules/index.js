import {maxDestructuredProperties} from './max-destructured-properties.js'
import {noDynamicImport} from './no-dynamic-import.js'

export const plugin = {
  meta: {
    name: 'eslint-nostandard',
  },

  rules: {
    'max-destructured-properties': maxDestructuredProperties,
    'no-dynamic-import': noDynamicImport,
  },
}

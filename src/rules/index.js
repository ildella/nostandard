import {maxDestructuredProperties} from './max-destructured-properties.js'

export const plugin = {
  meta: {
    name: 'eslint-nostandard',
  },

  rules: {
    'max-destructured-properties': maxDestructuredProperties,
  },
}

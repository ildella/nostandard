import {importX} from 'eslint-plugin-import-x'

export default {
  name: 'nostandard/import-x',
  files: ['src/**/*.js', 'src/**/*.svelte*', 'tests/**/*.js'],
  settings: {
    'import-x/extensions': [
      '.js',
      '.svelte',
      '.svelte.js',
    ],
  },
  plugins: {
    'import-x': importX,
  },
  rules: {
    'import-x/export': 'off',
    'import-x/no-cycle': 'off',
    'import-x/no-unresolved': 'off',
    'import-x/no-dynamic-require': 'warn',
    'import-x/order': 'warn',
    'import-x/max-dependencies': ['warn', {max: 10}],
    'import-x/no-mutable-exports': 'error',
    'import-x/no-self-import': 'error',
    'import-x/no-duplicates': 'error',
    'import-x/no-default-export': 'warn',
    'import-x/no-namespace': 'off',
    'import-x/no-named-as-default': 'off',
    'import-x/no-named-as-default-member': 'error',
    // 'import-x/no-nodejs-modules': 'error',
  },
}

import sonarjs from 'eslint-plugin-sonarjs'

export default {
  name: 'nostandard/sonarjs',
  plugins: {
    sonarjs,
  },
  rules: {
    ...sonarjs.configs.recommended.rules,
    'sonarjs/todo-tag': 'off',
    'sonarjs/cyclomatic-complexity': ['warn', {threshold: 8}],
    'sonarjs/expression-complexity': ['warn', {max: 3}],
    'sonarjs/unused-import': 'off',
    'sonarjs/no-unused-vars': 'warn',
    'sonarjs/no-dead-store': 'warn',
    'sonarjs/no-identical-functions': 'warn',
    'sonarjs/no-commented-code': 'warn',
  },
}

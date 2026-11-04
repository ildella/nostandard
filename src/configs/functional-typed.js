import functional from 'eslint-plugin-functional'
import tseslint from 'typescript-eslint'

export default {
  name: 'nostandard/functional-typed',
  files: ['**/*.{js,mjs,cjs}'],
  plugins: {functional},
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    'functional/immutable-data': 'warn',
  },
}

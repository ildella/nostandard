const stylisticJs = require('@stylistic/eslint-plugin-js')

const LINEBREAK_TYPE = 'never'
const STATEMENT_TYPE = 'default'

module.exports = {
  name: 'nostandard/style',

  plugins: {'@stylistic/js': stylisticJs},

  rules: {
    /* originals from ildella/style */
    ...stylisticJs.configs['all-flat'].rules,
    '@stylistic/js/array-element-newline': ['warn', 'consistent'],
    '@stylistic/js/array-bracket-newline': ['warn', 'consistent'],
    '@stylistic/js/arrow-parens': ['warn', 'as-needed'],
    '@stylistic/js/arrow-spacing': ['warn', {
      before: true,
      after: true,
    }],
    '@stylistic/js/comma-dangle': ['warn', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'only-multiline',
    }],
    '@stylistic/js/eol-last': ['warn', 'always'],
    '@stylistic/js/function-paren-newline': ['warn', 'multiline-arguments'],
    '@stylistic/js/function-call-argument-newline': ['warn', 'consistent'],
    '@stylistic/js/indent': ['warn', 2],
    '@stylistic/js/implicit-arrow-linebreak': 'warn',
    '@stylistic/js/lines-around-comment': ['off'],
    // consider: '@stylistic/js/key-spacing': ['warn', { beforeColon: false, afterColon: true }],
    '@stylistic/js/key-spacing': 'warn',
    '@stylistic/js/max-len': [
      'warn',
      {
        code: 100,
        tabWidth: 2,
        ignoreComments: false,
        ignoreTrailingComments: false,
        ignoreRegExpLiterals: false,
        ignoreStrings: false,
        ignoreTemplateLiterals: false,
        ignoreUrls: true,
      },
    ],
    '@stylistic/js/max-statements-per-line': ['warn', {max: 1}],
    // '@stylistic/js/multiline-comment-style': ['warn', 'bare-block'],
    '@stylistic/js/multiline-comment-style': ['off'],
    '@stylistic/js/newline-per-chained-call': 'warn',
    '@stylistic/js/no-confusing-arrow': [
      'warn',
      {allowParens: true, onlyOneSimpleParam: true},
    ],
    '@stylistic/js/no-extra-parens': 'warn',
    // consider ignoreEOLComments: true https://eslint.org/docs/latest/rules/no-multi-spaces
    '@stylistic/js/no-multi-spaces': 'warn',
    '@stylistic/js/no-multiple-empty-lines': [
      'warn',
      {
        max: 1,
        maxBOF: 0,
        maxEOF: 0,
      },
    ],
    '@stylistic/js/no-trailing-spaces': 'warn',
    '@stylistic/js/nonblock-statement-body-position': 'off',
    '@stylistic/js/no-whitespace-before-property': 'warn',
    '@stylistic/js/object-curly-spacing': 'warn',
    '@stylistic/js/object-curly-newline': ['warn', {
      multiline: true,
      consistent: true,
      minProperties: 4,
    }],
    '@stylistic/js/object-property-newline': [
      'warn',
      {allowAllPropertiesOnSameLine: true},
    ],
    'padding-line-between-statements': [
      'warn',
      {blankLine: LINEBREAK_TYPE, prev: STATEMENT_TYPE, next: STATEMENT_TYPE},
      {blankLine: LINEBREAK_TYPE, prev: STATEMENT_TYPE, next: STATEMENT_TYPE},
      {blankLine: LINEBREAK_TYPE, prev: STATEMENT_TYPE, next: STATEMENT_TYPE},
      {blankLine: LINEBREAK_TYPE, prev: STATEMENT_TYPE, next: STATEMENT_TYPE},
    ],
    '@stylistic/js/padded-blocks': ['warn', {
      blocks: 'never',
      switches: 'never',
      classes: 'never',
    }],
    // quotes: consider { avoidEscape: true, allowTemplateLiterals: false }
    '@stylistic/js/quotes': ['warn', 'single'],
    '@stylistic/js/quote-props': ['warn', 'consistent-as-needed'],
    '@stylistic/js/rest-spread-spacing': 'warn',
    '@stylistic/js/semi': ['error', 'never'],
    '@stylistic/js/space-before-blocks': 'warn',
    '@stylistic/js/space-before-function-paren': 'warn',
    '@stylistic/js/space-in-parens': ['warn', 'never'],
    '@stylistic/js/space-infix-ops': 'warn',
    // : unary: consider { words: true, nonwords: false }
    '@stylistic/js/space-unary-ops': 'warn',
    '@stylistic/js/spaced-comment': 'warn',

    /* new from neostandard - forced to warn - yet to be evaluated. */
    '@stylistic/js/array-bracket-spacing': ['warn', 'never'],
    '@stylistic/js/block-spacing': ['warn', 'always'],
    '@stylistic/js/brace-style': ['warn', '1tbs', {allowSingleLine: true}],
    '@stylistic/js/comma-spacing': ['warn', {before: false, after: true}],
    '@stylistic/js/comma-style': ['warn', 'last'],
    '@stylistic/js/computed-property-spacing': ['warn', 'never', {enforceForClassMembers: true}],
    '@stylistic/js/dot-location': ['warn', 'property'],
    '@stylistic/js/func-call-spacing': ['warn', 'never'],
    '@stylistic/js/generator-star-spacing': ['warn', {before: true, after: true}],
    '@stylistic/js/keyword-spacing': ['warn', {before: true, after: true}],
    '@stylistic/js/lines-between-class-members': ['warn', 'always', {exceptAfterSingleLine: true}],
    '@stylistic/js/multiline-ternary': ['warn', 'always-multiline'],
    '@stylistic/js/new-parens': 'warn',
    '@stylistic/js/no-floating-decimal': 'warn',
    '@stylistic/js/no-mixed-operators': ['warn', {
      groups: [
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof'],
      ],
      allowSamePrecedence: true,
    }],
    '@stylistic/js/no-mixed-spaces-and-tabs': 'warn',
    '@stylistic/js/no-tabs': 'warn',
    '@stylistic/js/operator-linebreak': ['warn', 'after', {
      overrides: {
        '?': 'before',
        ':': 'before',
        '|>': 'before',
      },
    }],
    '@stylistic/js/template-curly-spacing': ['warn', 'never'],
    '@stylistic/js/template-tag-spacing': ['warn', 'never'],
    '@stylistic/js/wrap-iife': ['warn', 'any', {functionPrototypeMethods: true}],
    '@stylistic/js/yield-star-spacing': ['warn', 'both'],
  },
}

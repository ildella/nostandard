import stylisticJs from '@stylistic/eslint-plugin'

const LINEBREAK_TYPE = 'never'
const STATEMENT_TYPE = 'default'

export const style = {
  name: 'nostandard/style',

  plugins: {'@stylistic': stylisticJs},

  rules: {
    ...stylisticJs.configs.all.rules,
    '@stylistic/array-element-newline': ['warn',
      {
        consistent: true,
        multiline: true,
        // minItems: 3,
      }],
    '@stylistic/array-bracket-newline': ['warn', 'consistent'],
    '@stylistic/arrow-parens': ['warn', 'as-needed'],
    '@stylistic/arrow-spacing': ['warn',
      {
        before: true,
        after: true,
      }],
    '@stylistic/comma-dangle': ['warn',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'only-multiline',
        importAttributes: 'never',
        dynamicImports: 'never',
        // style v6 beta
        // "enums": "never",
        // "generics": "never",
        // "tuples": "never"
      }],
    '@stylistic/eol-last': ['warn', 'always'],
    '@stylistic/function-paren-newline': ['warn', 'consistent'],
    '@stylistic/function-call-argument-newline': ['warn', 'consistent'],
    '@stylistic/indent': ['warn', 2],
    '@stylistic/implicit-arrow-linebreak': 'off',
    '@stylistic/lines-around-comment': ['off'],
    '@stylistic/key-spacing': 'warn',
    '@stylistic/max-len': [
      'warn',
      {
        code: 80,
        tabWidth: 2,
        ignoreComments: false,
        ignoreTrailingComments: false,
        ignoreRegExpLiterals: false,
        ignoreStrings: false,
        ignoreTemplateLiterals: false,
        ignoreUrls: false,
      },
    ],
    '@stylistic/max-statements-per-line': ['warn', {max: 1}],
    // '@stylistic/multiline-comment-style': ['warn', 'bare-block'],
    '@stylistic/multiline-comment-style': ['off'],
    '@stylistic/newline-per-chained-call': 'warn',
    '@stylistic/no-confusing-arrow': 'off',
    '@stylistic/no-extra-parens': ['warn',
      'all',
      {nestedBinaryExpressions: false}],
    // consider ignoreEOLComments: true
    // https://eslint.org/docs/latest/rules/no-multi-spaces
    '@stylistic/no-multi-spaces': 'warn',
    '@stylistic/no-multiple-empty-lines': [
      'warn',
      {
        max: 1,
        maxBOF: 0,
        maxEOF: 0,
      },
    ],
    '@stylistic/no-trailing-spaces': 'warn',
    '@stylistic/nonblock-statement-body-position': ['warn', 'below'],
    '@stylistic/no-whitespace-before-property': 'warn',
    '@stylistic/object-curly-spacing': 'warn',
    '@stylistic/object-curly-newline': ['warn',
      {
        multiline: true,
        consistent: true,
        minProperties: 4,
      }],
    '@stylistic/object-property-newline': [
      'warn', {allowAllPropertiesOnSameLine: true},
    ],
    '@stylistic/padding-line-between-statements': [
      'warn',
      {
        blankLine: LINEBREAK_TYPE,
        prev: STATEMENT_TYPE,
        next: STATEMENT_TYPE,
      },
      {
        blankLine: LINEBREAK_TYPE,
        prev: STATEMENT_TYPE,
        next: STATEMENT_TYPE,
      },
      {
        blankLine: LINEBREAK_TYPE,
        prev: STATEMENT_TYPE,
        next: STATEMENT_TYPE,
      },
      {
        blankLine: LINEBREAK_TYPE,
        prev: STATEMENT_TYPE,
        next: STATEMENT_TYPE,
      },
    ],
    '@stylistic/padded-blocks': [
      'warn',
      {
        blocks: 'never',
        switches: 'never',
        classes: 'never',
      },
    ],
    // quotes: consider { avoidEscape: true, allowTemplateLiterals: false }
    '@stylistic/quotes': ['warn', 'single'],
    '@stylistic/quote-props': ['warn', 'consistent-as-needed'],
    '@stylistic/rest-spread-spacing': 'warn',
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/space-before-blocks': 'warn',
    '@stylistic/space-before-function-paren': 'warn',
    '@stylistic/space-in-parens': ['warn', 'never'],
    '@stylistic/space-infix-ops': 'warn',
    // : unary: consider { words: true, nonwords: false }
    '@stylistic/space-unary-ops': 'warn',
    '@stylistic/spaced-comment': 'warn',

    /* new from neostandard - forced to warn - yet to be evaluated. */
    '@stylistic/array-bracket-spacing': ['warn', 'never'],
    '@stylistic/block-spacing': ['warn', 'always'],
    '@stylistic/brace-style': ['warn',
      '1tbs',
      {allowSingleLine: true}],
    '@stylistic/comma-spacing': ['warn', {before: false, after: true}],
    '@stylistic/comma-style': ['warn', 'last'],
    '@stylistic/computed-property-spacing': ['warn',
      'never',
      {enforceForClassMembers: true}],
    '@stylistic/dot-location': ['warn', 'property'],
    '@stylistic/func-call-spacing': ['warn', 'never'],
    '@stylistic/generator-star-spacing': [
      'warn',
      {before: true, after: true},
    ],
    '@stylistic/keyword-spacing': ['warn', {before: true, after: true}],
    '@stylistic/lines-between-class-members': ['warn',
      'always',
      {exceptAfterSingleLine: true}],
    '@stylistic/multiline-ternary': ['warn', 'always-multiline'],
    '@stylistic/new-parens': 'warn',
    '@stylistic/no-floating-decimal': 'warn',
    '@stylistic/no-mixed-operators': ['warn',
      {
        groups: [
          ['==',
            '!=',
            '===',
            '!==',
            '>',
            '>=',
            '<',
            '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
        allowSamePrecedence: true,
      }],
    '@stylistic/no-mixed-spaces-and-tabs': 'warn',
    '@stylistic/no-tabs': 'warn',
    '@stylistic/operator-linebreak': ['warn',
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before',
          '|>': 'before',
        },
      }],
    '@stylistic/template-curly-spacing': ['warn', 'never'],
    '@stylistic/template-tag-spacing': ['warn', 'never'],
    '@stylistic/wrap-iife': ['warn',
      'any',
      {functionPrototypeMethods: true}],
    '@stylistic/yield-star-spacing': ['warn', 'both'],
  },
}

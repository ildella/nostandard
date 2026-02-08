const eslintPluginSvelte = require('eslint-plugin-svelte')

module.exports = [
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
    name: 'nostandard/svelte',
    files: ['**/*.svelte', '**/*.svelte.js'],
    rules: {
      'svelte/html-closing-bracket-new-line': [
        'warn',
        {
          singleline: 'never',
          multiline: 'never',
          selfClosingTag: {
            singleline: 'never',
            multiline: 'never',
          },
        },
      ],
      'svelte/no-navigation-without-resolve': 'off',
      'svelte/html-quotes': [
        'warn',
        {
          prefer: 'single',
          dynamic: {
            quoted: false,
            avoidInvalidUnquotedInHTML: false,
          },
        },
      ],
      'svelte/first-attribute-linebreak': [
        'warn',
        {
          multiline: 'below',
          singleline: 'beside',
        },
      ],
      'svelte/indent': [
        'warn',
        {
          indent: 2,
          ignoredNodes: [],
          switchCase: 1,
          alignAttributesVertically: false,
        },
      ],
      'svelte/max-attributes-per-line': [
        'warn',
        {
          multiline: 1,
          singleline: 1,
        },
      ],
      'svelte/mustache-spacing': [
        'warn',
        {
          textExpressions: 'never',
          attributesAndProps: 'never',
          directiveExpressions: 'never',
          tags: {
            openingBrace: 'never',
            closingBrace: 'never',
          },
        },
      ],
      'svelte/no-dom-manipulating': 'error',
      'svelte/no-dupe-on-directives': 'error',
      'svelte/no-spaces-around-equal-signs-in-attribute':
        'warn',
      'svelte/no-inline-styles': 'off',
      'svelte/no-target-blank': [
        'error',
        {
          allowReferrer: true,
          enforceDynamicLinks: 'always',
        },
      ],
      'no-return-assign': 'off',
      'prefer-const': 'off',
      '@stylistic/js/indent': 'off',
      '@stylistic/js/max-len': 'error',
    },
  },
]

const defaultMessage = selector => `Using '${selector}' is not allowed.`

const listener = (context, option) => {
  const isString = typeof option === 'string'
  const selector = isString ? option : option.selector
  const message = isString
    ? defaultMessage(selector)
    : option.message ?? defaultMessage(selector)

  return [
    selector,
    node => {
      context.report({node, messageId: 'restrictedSyntax', data: {message}})
    },
  ]
}

export const restrictedSyntax = {
  meta: {
    type: 'suggestion',

    docs: {
      description: 'Disallow specified syntax under a nostandard ruleId',
    },

    schema: {
      type: 'array',
      items: {
        oneOf: [
          {type: 'string'},
          {
            type: 'object',
            properties: {
              selector: {type: 'string'},
              message: {type: 'string'},
            },
            required: ['selector'],
            additionalProperties: false,
          },
        ],
      },
      uniqueItems: true,
      minItems: 0,
    },

    messages: {
      restrictedSyntax: '{{message}}',
    },
  },

  create: context => Object.fromEntries(
    context.options.map(option => listener(context, option)),
  ),
}

const FUNCTION_TYPES = [
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
]

const unwrapDefault = param =>
  param.type === 'AssignmentPattern' ? param.left : param

const destructuredPattern = param => {
  const unwrapped = unwrapDefault(param)
  return unwrapped.type === 'ObjectPattern' ? unwrapped : null
}

const countProperties = pattern =>
  pattern.properties.filter(property => property.type === 'Property')
    .length

export const maxDestructuredProperties = {
  meta: {
    type: 'suggestion',

    docs: {
      description: 'Limit the properties destructured in a parameter',
    },

    schema: [
      {
        type: 'object',
        properties: {max: {type: 'integer', minimum: 0}},
        additionalProperties: false,
      },
    ],

    messages: {
      tooMany: 'Function destructures {{count}} properties, max is {{max}}.' +
        ' Split the function instead of moving the destructuring' +
        ' inside its body.',
    },
  },

  create (context) {
    const {max = 3} = context.options[0] ?? {}

    const check = node => {
      for (const param of node.params) {
        const pattern = destructuredPattern(param)
        if (pattern === null) {
          continue
        }

        const count = countProperties(pattern)
        if (count > max) {
          context.report({
            node: pattern,
            messageId: 'tooMany',
            data: {count, max},
          })
        }
      }
    }

    return Object.fromEntries(FUNCTION_TYPES.map(type => [type, check]))
  },
}

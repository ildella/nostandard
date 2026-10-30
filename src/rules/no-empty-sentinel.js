const NULL_MESSAGE = 'Do not use null as a value.' +
  ' Absence is [], or throw.'

const EMPTY_MESSAGE = 'Do not use \'\' as a value.' +
  ' Absence is [], or throw.'

const isSentinel = node =>
  node.type === 'Literal' && (node.value === null || node.value === '')

const messageIdFor = node =>
  node.value === null ? 'null' : 'emptyString'

const skipWrapper = (parent, child) => {
  if (parent.type === 'ParenthesizedExpression')
    return true
  return parent.type === 'ConditionalExpression' && parent.test !== child
}

const valueParent = node => {
  let current = node
  let parent = current.parent
  while (parent && skipWrapper(parent, current)) {
    current = parent
    parent = current.parent
  }
  return {parent, child: current}
}

const isReturnValue = (parent, child) =>
  parent.type === 'ReturnStatement' && parent.argument === child

const isArrowBody = (parent, child) =>
  parent.type === 'ArrowFunctionExpression' && parent.body === child

const isInitializer = (parent, child) =>
  parent.type === 'VariableDeclarator' && parent.init === child

const isAssignment = (parent, child) =>
  parent.type === 'AssignmentExpression' && parent.right === child

const isFallbackOperand = (parent, child) => {
  if (parent.type !== 'LogicalExpression')
    return false
  const isOperand = parent.left === child || parent.right === child
  return isOperand && (parent.operator === '||' || parent.operator === '??')
}

const positions = [
  isReturnValue,
  isArrowBody,
  isInitializer,
  isAssignment,
  isFallbackOperand,
]

const isForbidden = node => {
  const {parent, child} = valueParent(node)
  if (!parent)
    return false
  return positions.some(check => check(parent, child))
}

export const noEmptySentinel = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow null and empty string as a value.',
    },
    schema: [],
    messages: {
      null: NULL_MESSAGE,
      emptyString: EMPTY_MESSAGE,
    },
  },

  create: context => ({
    Literal: node => {
      if (!isSentinel(node) || !isForbidden(node))
        return
      context.report({node, messageId: messageIdFor(node)})
    },
  }),
}

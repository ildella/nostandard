export const noDynamicImport = {
  meta: {
    type: 'suggestion',

    docs: {
      description: 'Disallow dynamic import()',
    },

    schema: [],

    messages: {
      banned: 'Dynamic import() is banned.' +
        ' Use a static import and let the bundler split the code.',
    },
  },

  create: context => ({
    ImportExpression: node => {
      context.report({node, messageId: 'banned'})
    },
  }),
}

const SPY_MESSAGE = 'Thou shalt not use spyOn on console logs.'

export const restrictedSyntaxList = [
  {
    selector: 'MethodDefinition[kind="get"]',
    message: 'Getters are forbidden.' +
      ' Use pure functions or derived state.',
  },
  {
    selector: 'MethodDefinition[kind="set"]',
    message: 'Setters are forbidden.' +
      ' Use explicit updater functions.',
  },
  {
    selector: 'Property[kind="get"]',
    message: 'Object getters are forbidden.' +
      ' "get" properties are considered code crimes here.',
  },
  {
    selector: 'Property[kind="set"]',
    message: 'Object setters are forbidden.',
  },
  {
    selector: 'CallExpression[callee.name=\'spyOn\']' +
      '[arguments.0.name=\'console\']',
    message: SPY_MESSAGE,
  },
  {
    selector: 'CallExpression[callee.property.name=\'spyOn\']' +
      '[arguments.0.name=\'console\']',
    message: SPY_MESSAGE,
  },
  {
    selector: 'CallExpression[callee.object.name=\'Promise\']' +
      '[callee.property.name=\'resolve\']' +
      '[arguments.0.raw=\'null\']',
    message: 'Only losers use Promise.resolve(null).' +
      ' Real men throw an exception.',
  },
]

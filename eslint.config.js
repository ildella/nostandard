const nostandard = require('./')

module.exports = [
  ...nostandard.configs.recommended,
  nostandard.configs.vitest,
]

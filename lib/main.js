const base = require('./configs/base')
const style = require('./configs/style')

const configs = {
  base,
  style,
  recommended: [base, style],
  get svelte () { return require('./configs/svelte') },
  get vitest () { return require('./configs/vitest') },
}

module.exports = {configs}

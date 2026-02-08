const base = require('./configs/base')
const style = require('./configs/style')

const configs = {
  base,
  style,
  recommended: [base, style],
}

module.exports = {configs}

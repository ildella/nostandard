const {configs} = require('./lib/main')

module.exports = {
  configs,
  plugins: {
    get '@stylistic/js' () {
      return require('@stylistic/eslint-plugin-js')
    },
  },
}

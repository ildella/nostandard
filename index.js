/** @typedef {import('./lib/main').NostandardOptions} NostandardOptions */

module.exports = require('./lib/main').nostandard

// module.exports.resolveIgnoresFromGitignore =
//   require('./lib/resolve-gitignore').resolveIgnoresFromGitignore

module.exports.plugins = /** @type {const} */ {
  get '@stylistic/js' () {
    return require('@stylistic/eslint-plugin-js')
  },
  // get 'import-x' () {
  //   return require('eslint-plugin-import-x')
  // },
  // get n () {
  //   return require('eslint-plugin-n')
  // },
  // get promise () {
  //   // @ts-ignore
  //   return require('eslint-plugin-promise')
  // },
  // get 'typescript-eslint' () {
  //   return require('typescript-eslint')
  // },
}

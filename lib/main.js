const base = require('./configs/base')

/**
 * @typedef NostandardOptions
 * @property {Array<keyof import('globals')>|undefined} [env] - resolves globals for the provided environment names using the {@link https://www.npmjs.com/package/globals|globals module}
 * @property {string[]|undefined} [files] - file patterns, in minimatch syntax, the config applies to, see {@link https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores|ESLint Docs}
 * @property {import('eslint').Linter.Globals|string[]|undefined} [globals] - the base globals that should be considered available, see {@link https://eslint.org/docs/latest/use/configure/language-options#specifying-globals|ESLint Docs}
 * @property {string[]|undefined} [ignores] - patterns in minimatch syntax for files to ignore
 * @property {boolean|undefined} [noStyle] - when set, skips style rules
 */

/**
 * @param {NostandardOptions} [options]
 * @returns {import('eslint').Linter.Config[]}
 */
function nostandard (options) {
  const {
    ignores,
    noStyle = false,
  } = options || {}

  const styleConfigs = noStyle
    ? []
    : [
      require('./configs/style'),
    ]

  const finalConfigs = [
    base,
    ...styleConfigs,
  ]

  return [
    /* To make it a global ignore, "ignores" has to be the lone key of the config, hence no "name":
       https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores */
    ...ignores
      ? [{ignores}]
      : [],
    ...finalConfigs,
  ]
}

module.exports = {nostandard}

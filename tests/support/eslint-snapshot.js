import defaultExport, {nostandard} from '../../src/index.js'
import svelte from '../../src/configs/svelte.js'
import vitest from '../../src/configs/vitest.js'
import importX from '../../src/configs/import-x.js'
import sonarjs from '../../src/configs/sonarjs.js'
import functional from '../../src/configs/functional.js'
import unicorn from '../../src/configs/unicorn.js'
import playwright from '../../src/configs/playwright.js'
import {plugin} from '../../src/rules/index.js'

const MISSING = globalThis.Symbol('missing')
const OBJECT = '[object]'
const PARSER = '[parser]'
const PROCESSOR = '[processor]'
const CONFIG_KEYS = [
  'files',
  'ignores',
  'languageOptions',
  'linterOptions',
  'name',
  'plugins',
  'processor',
  'rules',
  'settings',
]

const isObject = value => value !== null && typeof value === 'object'

const isPlain = value => {
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

const serialize = value => {
  if (Array.isArray(value))
    return value.map(serialize)
  if (!isObject(value))
    return value
  if (!isPlain(value))
    return OBJECT
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map(key => [key, serialize(value[key])]),
  )
}

const defined = object => Object.fromEntries(
  Object.entries(object)
    .filter(([, value]) => value !== MISSING),
)

const parserOptionsOf = options => {
  if (!options)
    return MISSING
  const plain = serialize(options)
  return options.parser ? {...plain, parser: PARSER} : plain
}

const languageOptionsOf = config => {
  if (!config.languageOptions)
    return MISSING
  const {
    sourceType,
    globals,
    ecmaVersion,
    parser,
    parserOptions,
  } = config.languageOptions
  return defined(serialize({
    sourceType,
    globals,
    ecmaVersion,
    parser: parser ? PARSER : MISSING,
    parserOptions: parserOptionsOf(parserOptions),
  }))
}

const pluginsOf = config =>
  config.plugins ? Object.keys(config.plugins).sort() : MISSING

const configFields = config => defined({
  name: config.name,
  files: serialize(config.files),
  ignores: serialize(config.ignores),
  plugins: pluginsOf(config),
  linterOptions: serialize(config.linterOptions),
  settings: serialize(config.settings),
  processor: config.processor ? PROCESSOR : MISSING,
  languageOptions: languageOptionsOf(config),
  rules: config.rules ? serialize(config.rules) : MISSING,
})

const isConfig = value => CONFIG_KEYS.some(key => key in value)

const normalize = value => {
  if (Array.isArray(value))
    return value.map(normalize)
  if (!isObject(value))
    return value
  if (isConfig(value))
    return serialize(configFields(value))
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map(key => [key, normalize(value[key])]),
  )
}

const normalizePlugin = rulesPlugin => serialize({
  meta: rulesPlugin.meta,
  rules: Object.keys(rulesPlugin.rules).sort(),
})

const exportsSnapshot = () => ({
  default: normalize(defaultExport),
  nostandard: normalize(nostandard),
  svelte: normalize(svelte),
  vitest: normalize(vitest),
  importX: normalize(importX),
  sonarjs: normalize(sonarjs),
  functional: normalize(functional),
  unicorn: normalize(unicorn),
  playwright: normalize(playwright),
  plugin: normalizePlugin(plugin),
})

export const snapshot = () =>
  JSON.parse(JSON.stringify(serialize(exportsSnapshot())))

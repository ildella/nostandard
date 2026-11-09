import {DENY_LIST} from './deny-list.js'

const SVELTE_PLUGIN = 'eslint-plugin-svelte'
const RESERVED = new Set(['import-x'])
const IMPORT_PREFIX = 'import/'
const IMPORT_X_PREFIX = 'import-x/'
const SVELTE_PREFIX = 'svelte/'
const SCOPED_PLUGIN = '/eslint-plugin'
const BARE_PLUGIN = 'eslint-plugin-'
const NOSTANDARD = {
  name: 'nostandard',
  specifier: 'eslint-nostandard/oxlint/plugin',
}
const IGNORE = [
  '**/*.svelte',
  '**/*.svelte.js',
  '**/*.svelte.ts',
]
const CATEGORIES = [
  'correctness',
  'suspicious',
  'pedantic',
  'perf',
  'style',
  'restriction',
  'nursery',
]

const pluginNameOf = specifier => {
  if (specifier.startsWith('@') && specifier.endsWith(SCOPED_PLUGIN))
    return specifier.slice(0, -SCOPED_PLUGIN.length)
  if (specifier.startsWith(BARE_PLUGIN))
    return specifier.slice(BARE_PLUGIN.length)
  return specifier
}

const toPlugin = entry => typeof entry === 'string'
  ? {name: pluginNameOf(entry), specifier: entry}
  : {
    name: entry.name ?? pluginNameOf(entry.specifier),
    specifier: entry.specifier,
  }

const dedupeByName = plugins =>
  [...new Map(plugins.map(plugin => [plugin.name, plugin])).values()]

const dropSveltePlugin = plugins =>
  plugins.map(toPlugin).filter(plugin => plugin.specifier !== SVELTE_PLUGIN)

const dropReservedPlugin = plugins =>
  plugins.filter(plugin => !RESERVED.has(plugin.name))

const importXId = id => id.startsWith(IMPORT_PREFIX)
  ? `${IMPORT_X_PREFIX}${id.slice(IMPORT_PREFIX.length)}`
  : id

const isDenied = id => id.startsWith(SVELTE_PREFIX) || DENY_LIST.has(id)

const cleanRules = rules => Object.fromEntries(
  Object.entries(rules ?? {})
    .filter(([id]) => !isDenied(id))
    .map(([id, value]) => [importXId(id), value]),
)

const cleanPlugins = plugins => dropReservedPlugin(dedupeByName([
  ...dropSveltePlugin(plugins ?? []),
  NOSTANDARD,
]))

const cleanOverride = override => {
  const withRules = override.rules
    ? {...override, rules: cleanRules(override.rules)}
    : override
  if (!override.jsPlugins)
    return withRules
  return {
    ...withRules,
    jsPlugins: dropReservedPlugin(dropSveltePlugin(override.jsPlugins)),
  }
}

const allOff = () =>
  Object.fromEntries(CATEGORIES.map(name => [name, 'off']))

const mergedIgnorePatterns = patterns => {
  const existing = patterns ?? []
  return [...new Set([...existing, ...IGNORE])]
}

const withOverrides = config => config.overrides
  ? {...config, overrides: config.overrides.map(cleanOverride)}
  : config

export const postProcess = (config = {}) => withOverrides({
  ...config,
  categories: allOff(),
  ignorePatterns: mergedIgnorePatterns(config.ignorePatterns),
  jsPlugins: cleanPlugins(config.jsPlugins),
  rules: cleanRules(config.rules),
})

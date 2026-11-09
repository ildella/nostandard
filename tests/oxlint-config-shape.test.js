import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {SLICE_FILE} from '../src/oxlint/slices.js'

const GENERATED_DIR = fileURLToPath(
  new globalThis.URL('../src/generated/', import.meta.url),
)
const STEMS = Object.values(SLICE_FILE)
const CATEGORIES = [
  'correctness',
  'suspicious',
  'pedantic',
  'perf',
  'style',
  'restriction',
  'nursery',
]
const SVELTE_IGNORES = [
  '**/*.svelte',
  '**/*.svelte.js',
  '**/*.svelte.ts',
]
const SVELTE_PLUGIN = 'eslint-plugin-svelte'
const CUSTOM_RULES = {
  recommended: [
    'nostandard/no-dynamic-import',
    'nostandard/max-destructured-properties',
    'nostandard/restricted-syntax',
  ],
  functional: ['nostandard/no-empty-sentinel'],
}

const configOf = stem => JSON.parse(
  readFileSync(join(GENERATED_DIR, `${stem}.oxlint.json`), 'utf8'),
)

const offOf = stem => JSON.parse(
  readFileSync(join(GENERATED_DIR, `${stem}.eslint-off.json`), 'utf8'),
)

const overridesOf = config => config.overrides ?? []

const ruleIds = config => [
  ...Object.keys(config.rules ?? {}),
  ...overridesOf(config).flatMap(override => Object.keys(override.rules ?? {})),
]

const jsPlugins = config => [
  ...config.jsPlugins ?? [],
  ...overridesOf(config).flatMap(override => override.jsPlugins ?? []),
]

const matching = (ids, prefix) => ids.filter(id => id.startsWith(prefix))

test.each(STEMS)('%s disables every known category', stem => {
  const config = configOf(stem)
  expect(config.categories).toEqual(
    Object.fromEntries(CATEGORIES.map(name => [name, 'off'])),
  )
})

test.each(STEMS)('%s ignores every svelte extension', stem => {
  const {ignorePatterns = []} = configOf(stem)
  const missing = SVELTE_IGNORES.filter(
    pattern => !ignorePatterns.includes(pattern),
  )
  expect(missing).toEqual([])
})

test.each(STEMS)('%s keeps svelte rules out of every scope', stem => {
  expect(matching(ruleIds(configOf(stem)), 'svelte/')).toEqual([])
})

test.each(STEMS)('%s scopes its off-set by extension', stem => {
  offOf(stem).forEach(({files, ignores}) => {
    expect(files).not.toContain('**/*')
    expect(ignores).toContain('**/*.svelte')
  })
})

test.each(STEMS)('%s keeps the svelte plugin out of every scope', stem => {
  const specifiers = jsPlugins(configOf(stem)).map(plugin => plugin.specifier)
  expect(specifiers).not.toContain(SVELTE_PLUGIN)
})

test.each(STEMS)('%s keeps import-x ids unprefixed', stem => {
  expect(matching(ruleIds(configOf(stem)), 'import/')).toEqual([])
})

test('recommended keeps the custom nostandard rules', () => {
  const {rules} = configOf('recommended')
  const missing = CUSTOM_RULES.recommended.filter(
    id => !(id in rules),
  )
  expect(missing).toEqual([])
  expect(rules).not.toHaveProperty('nostandard/no-empty-sentinel')
})

test('functional keeps the empty sentinel rule', () => {
  const {rules} = configOf('functional')
  const missing = CUSTOM_RULES.functional.filter(id => !(id in rules))
  expect(missing).toEqual([])
})

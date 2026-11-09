import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {SLICE_FILE} from '../src/oxlint/slices.js'
import {OFFSET_FILES, SVELTE_IGNORES} from '../src/oxlint/file-scope.js'
import {enabledByScope} from '../src/oxlint/partition.js'

const GENERATED_DIR = fileURLToPath(
  new globalThis.URL('../src/generated/', import.meta.url),
)
const STEMS = Object.values(SLICE_FILE)
const DENIED = 'vitest/no-conditional-expect'

const readGenerated = (stem, suffix) => JSON.parse(
  readFileSync(join(GENERATED_DIR, `${stem}.${suffix}.json`), 'utf8'),
)

const configOf = stem => readGenerated(stem, 'oxlint')

const offOf = stem => readGenerated(stem, 'eslint-off')

const idsOf = entries => [
  ...new Set(entries.flatMap(entry => Object.keys(entry.rules))),
].sort()

const offIds = stem => idsOf(offOf(stem))

const enabledIds = stem => [
  ...new Set(enabledByScope(configOf(stem)).flatMap(scope => scope.ids)),
].sort()

const sameFiles = (left, right) =>
  [...left].sort().join('\u0000') === [...right].sort().join('\u0000')

test.each(STEMS)('%s off-set is an array of scoped config objects', stem => {
  const entries = offOf(stem)
  expect(Array.isArray(entries)).toBe(true)
  expect(entries.length).toBeGreaterThan(0)
  entries.forEach(entry => {
    expect(Array.isArray(entry.files)).toBe(true)
    expect(entry.ignores).toEqual(SVELTE_IGNORES)
    expect(Object.keys(entry.rules).length).toBeGreaterThan(0)
    const enabled = Object.values(entry.rules).filter(value => value !== 'off')
    expect(enabled).toEqual([])
  })
})

test.each(STEMS)('%s off-set ids equal the enabled oxlint ids', stem => {
  expect(offIds(stem)).toEqual(enabledIds(stem))
})

test('recommended off-set is global on js and ts files only', () => {
  offOf('recommended').forEach(entry =>
    expect(entry.files).toEqual(OFFSET_FILES))
})

test('vitest off-set is scoped and omits no-undefined', () => {
  const [entry] = offOf('vitest')
  expect(sameFiles(entry.files, ['tests/**/*.js', '**/*.test.js'])).toBe(true)
  expect(offIds('vitest')).not.toContain('no-undefined')
})

test('playwright off-set is scoped and omits no-empty-pattern', () => {
  const [entry] = offOf('playwright')
  expect(sameFiles(entry.files, ['e2e/**/*.*js'])).toBe(true)
  expect(offIds('playwright')).not.toContain('no-empty-pattern')
})

test('denied vitest rule leaves the oxlint config and its off-set', () => {
  const ids = enabledIds('vitest')
  expect(ids).not.toContain(DENIED)
  expect(offIds('vitest')).not.toContain(DENIED)
})

test('recommended keeps migrated severity options', () => {
  const {rules} = configOf('recommended')
  expect(rules.complexity).toEqual(['warn', 5])
  expect(rules['max-lines']).toEqual(['warn', 180])
  expect(rules['@stylistic/indent']).toEqual(['warn', 2])
})

test('vitest keeps the max-nested-describe option', () => {
  const [override] = configOf('vitest').overrides
  expect(override.rules['vitest/max-nested-describe']).toEqual([
    'error',
    {max: 1},
  ])
})

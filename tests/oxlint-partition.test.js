import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {SLICE_FILE, SLICES} from '../src/oxlint/slices.js'
import {
  assertScopesKnown,
  checkPartition,
  enabledByScope,
  eslintScopesOf,
} from '../src/oxlint/partition.js'

const GENERATED_DIR = fileURLToPath(
  new globalThis.URL('../src/generated/', import.meta.url),
)
const KEYS = Object.keys(SLICES)
const WITH_REMAINDER = ['recommended', 'unicorn', 'vitest', 'importX']
const DENIED = [
  'vitest/no-conditional-expect',
  'vitest/valid-expect',
]

const readGenerated = (stem, suffix) => JSON.parse(
  readFileSync(join(GENERATED_DIR, `${stem}.${suffix}.json`), 'utf8'),
)

const oxlintConfigOf = key => readGenerated(SLICE_FILE[key], 'oxlint')

const offIdsOf = key =>
  readGenerated(SLICE_FILE[key], 'eslint-off')
    .flatMap(entry => Object.keys(entry.rules))

const partitionOf = key =>
  checkPartition(SLICES[key], oxlintConfigOf(key))

const scopeCheckOf = key => () => assertScopesKnown(
  eslintScopesOf(SLICES[key]),
  enabledByScope(oxlintConfigOf(key)),
)

test.each(KEYS)('%s slice partitions without unknown ids', key => {
  expect(() => partitionOf(key)).not.toThrow()
})

test.each(KEYS)('%s scopes are known to the ESLint slice', key => {
  expect(scopeCheckOf(key)).not.toThrow()
})

test.each(KEYS)('%s remainder exists exactly where reported', key => {
  const {remainder} = partitionOf(key)
  expect(remainder.length > 0).toBe(WITH_REMAINDER.includes(key))
})

test.each(KEYS)('%s remainder ids stay enabled on ESLint', key => {
  const {remainder} = partitionOf(key)
  const offIds = offIdsOf(key)
  const suppressed = remainder.filter(id => offIds.includes(id))
  expect(suppressed).toEqual([])
})

test('vitest remainder is the denied rules', () => {
  expect(partitionOf('vitest').remainder).toEqual(DENIED)
})

test('an override-only id is not counted as globally covered', () => {
  const eslintScopes = eslintScopesOf([{
    files: ['tests/**/*.js'],
    rules: {'vitest/expect-expect': 'error'},
  }])
  const oxlintScopes = enabledByScope({
    rules: {'no-undefined': 'error'},
    overrides: [{
      files: ['tests/**/*.js'],
      rules: {'vitest/expect-expect': 'error'},
    }],
  })
  expect(() => assertScopesKnown(eslintScopes, oxlintScopes))
    .toThrow(/no-undefined/)
})

test('an unmatched override falls back to the global ESLint scope', () => {
  const eslintScopes = eslintScopesOf([{rules: {'no-undefined': 'error'}}])
  const oxlintScopes = enabledByScope({
    rules: {},
    overrides: [{
      files: ['e2e/**/*.*js'],
      rules: {'no-undefined': 'error'},
    }],
  })
  expect(() => assertScopesKnown(eslintScopes, oxlintScopes)).not.toThrow()
})

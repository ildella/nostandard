import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {parseUnmigrated} from '../scripts/oxlint-migrate.js'

const FIXTURES = fileURLToPath(
  new globalThis.URL('./fixtures/', import.meta.url),
)

const fixture = readFileSync(
  join(FIXTURES, 'oxlint-migrate-details.txt'),
  'utf8',
)

const detailsOf = groups => [
  '   Skipped 2 rules:',
  ...groups,
].join('\n')

test('parses the real @oxlint/migrate details output', () => {
  expect(parseUnmigrated(fixture)).toStrictEqual([
    'camelcase',
    'dot-notation',
    'no-dupe-args',
    'no-octal',
    'no-octal-escape',
    'no-undef',
    'no-undef-init',
    'no-unreachable-loop',
    'no-useless-assignment',
  ])
})

test('returns no ids when @oxlint/migrate skips nothing', () => {
  expect(parseUnmigrated(
    '\n✔ oxlint.json created with 6 rules.\n',
  )).toStrictEqual([])
})

test('throws when a skipped rule is not parsed', () => {
  const text = detailsOf(['     - 2 Unsupported', '       - no-octal'])
  expect(() => parseUnmigrated(text)).toThrow(/reported 2 "Unsupported" rules/)
})

test('throws when the header count does not add up', () => {
  const text = detailsOf(['     - 1 Unsupported', '       - no-octal'])
  expect(() => parseUnmigrated(text)).toThrow(/reported 2 skipped rules/)
})

test('throws on an unrecognised line inside the details block', () => {
  const text = detailsOf([
    '     - 1 Unsupported',
    '       - no-octal',
    '       ? format changed',
  ])
  expect(() => parseUnmigrated(text)).toThrow(/Unrecognised/)
})

test('throws when a rule line appears before any group', () => {
  const text = detailsOf(['       - no-octal'])
  expect(() => parseUnmigrated(text)).toThrow(/Unrecognised/)
})

import {Linter} from 'eslint'
import {nostandard} from '../src/index.js'
import functional from '../src/configs/functional.js'
import {plugin} from '../src/rules/index.js'

const RULE = 'nostandard/no-empty-sentinel'

const linter = new Linter({configType: 'flat'})
const configs = [...nostandard.recommended, functional]
const lint = code => linter.verify(code, configs)
const hits = code => lint(code).filter(message => message.ruleId === RULE)

test('the plugin exports the rule', () => {
  expect(plugin.rules['no-empty-sentinel']).toBeDefined()
})

test('recommended does not enable the rule', () => {
  const enabled = nostandard.recommended.some(
    config => Object.hasOwn(config.rules ?? {}, RULE),
  )
  expect(enabled).toBe(false)
})

test('functional enables the rule as warn', () => {
  expect(functional.rules[RULE]).toBe('warn')
})

test('functional tightens no-param-reassign to props', () => {
  expect(functional.rules['no-param-reassign']).toEqual(
    ['warn', {props: true}],
  )
})

test.each([
  ['return null', 'export const fn = () => {\n  return null\n}\n', 'null'],
  [
    'return empty string',
    'export const fn = () => {\n  return \'\'\n}\n',
    '\'\'',
  ],
  ['implicit null', 'export const fn = () => null\n', 'null'],
  ['implicit empty string', 'export const fn = () => \'\'\n', '\'\''],
  [
    'ternary return',
    'export const fn = cond => {\n  return cond ? null : cond\n}\n',
    'null',
  ],
  ['const null', 'export const x = null\n', 'null'],
  ['const empty string', 'export const x = \'\'\n', '\'\''],
  ['assign null', 'let x = 1\nx = null\n', 'null'],
  [
    'or null',
    'const value = 1\nexport const x = value || null\n',
    'null',
  ],
  [
    'nullish empty',
    'const value = 1\nexport const x = value ?? \'\'\n',
    '\'\'',
  ],
  [
    'null or value',
    'const value = 1\nexport const x = null || value\n',
    'null',
  ],
])('%s warns', (_label, code, token) => {
  const found = hits(code)
  expect(found).toHaveLength(1)
  expect(found[0].severity).toBe(1)
  expect(found[0].message).toContain(token)
})

test.each([
  ['compare null', 'const x = 1\nexport const y = x === null\n'],
  ['call null', 'const fn = () => 1\nexport const x = fn(null)\n'],
  ['call empty', 'const fn = () => 1\nexport const x = fn(\'\')\n'],
  ['return list', 'export const fn = () => []\n'],
  ['return value', 'export const fn = value => value\n'],
  ['space string', 'export const x = \' \'\n'],
  ['array null', 'export const xs = [null]\n'],
])('%s is allowed', (_label, code) => {
  expect(hits(code)).toHaveLength(0)
})

import {Linter} from 'eslint'
import {nostandard} from '../src/index.js'
import {plugin} from '../src/rules/index.js'

const RULE = 'nostandard/no-dynamic-import'

const linter = new Linter()
const lint = code => linter.verify(code, [nostandard.base])
const findRule = (messages, ruleId) =>
  messages.filter(m => m.ruleId === ruleId)

test('the plugin exports the rule', () => {
  expect(plugin.rules['no-dynamic-import']).toBeDefined()
})

test('the base config enables it as warn', () => {
  expect(nostandard.base.rules[RULE]).toBe('warn')
})

test('static imports are fine', () => {
  const code = [
    'import {readFile} from \'node:fs/promises\'',
    'export const fn = readFile',
    '',
  ].join('\n')
  expect(findRule(lint(code), RULE)).toHaveLength(0)
})

test('dynamic import warns', () => {
  const code = [
    'const load = path => import(path)',
    'export {load}',
    '',
  ].join('\n')
  const hits = findRule(lint(code), RULE)
  expect(hits).toHaveLength(1)
  expect(hits[0].severity).toBe(1)
  expect(hits[0].message).toContain('Dynamic import() is banned')
})

test('a literal specifier is still banned', () => {
  const code = 'export const mod = import(\'./mod.js\')\n'
  expect(findRule(lint(code), RULE)).toHaveLength(1)
})

test('import options and non-literal specifiers are banned', () => {
  const code = [
    'const name = \'./mod\'',
    'const options = {with: {type: \'json\'}}',
    'export const load = () => import(name + \'.json\', options)',
    '',
  ].join('\n')
  expect(findRule(lint(code), RULE)).toHaveLength(1)
})

test('every occurrence is reported', () => {
  const code = [
    'export const load = path => import(path)',
    'export const other = async path => {',
    '  const mod = await import(path)',
    '  return mod',
    '}',
    '',
  ].join('\n')
  expect(findRule(lint(code), RULE)).toHaveLength(2)
})

test('the rule can be turned off per project', () => {
  const base = nostandard.base
  const messages = linter.verify('export const m = import(\'./m.js\')\n', [
    {...base, rules: {...base.rules, [RULE]: 'off'}},
  ])
  expect(findRule(messages, RULE)).toHaveLength(0)
})

import {Linter} from 'eslint'
import {nostandard} from '../src/index.js'

const RULE = 'nostandard/max-destructured-properties'

const linter = new Linter()
const lint = code => linter.verify(code, [nostandard.base])
const findRule = (messages, ruleId) =>
  messages.filter(m => m.ruleId === ruleId)

const lintAt = (code, max) => {
  const base = nostandard.base
  return linter.verify(code, [
    {
      ...base,
      rules: {...base.rules, [RULE]: ['warn', {max}]},
    },
  ])
}

test('three destructured properties stay under the limit', () => {
  const code = [
    'const fn = ({a, b, c}) => a + b + c',
    'fn({a: 1, b: 2, c: 3})',
    '',
  ].join('\n')
  expect(findRule(lint(code), RULE)).toHaveLength(0)
})

test('four destructured properties in an arrow warn', () => {
  const code = [
    'const fn = ({a, b, c, d}) => [a, b, c, d]',
    'fn({a: 1, b: 2, c: 3, d: 4})',
    '',
  ].join('\n')
  const hits = findRule(lint(code), RULE)
  expect(hits).toHaveLength(1)
  expect(hits[0].severity).toBe(1)
  expect(hits[0].message).toContain('destructures 4 properties')
  expect(hits[0].message).toContain('Split the function')
})

test('function declarations are counted', () => {
  const code = [
    'function fn ({a, b, c, d}) {',
    '  return [a, b, c, d]',
    '}',
    'fn({a: 1, b: 2, c: 3, d: 4})',
    '',
  ].join('\n')
  expect(findRule(lint(code), RULE)).toHaveLength(1)
})

test('function expressions are counted', () => {
  const code = [
    'const fn = function ({a, b, c, d}) {',
    '  return [a, b, c, d]',
    '}',
    'fn({a: 1, b: 2, c: 3, d: 4})',
    '',
  ].join('\n')
  expect(findRule(lint(code), RULE)).toHaveLength(1)
})

test('default parameter form is counted', () => {
  const code = [
    'const fn = ({a, b, c, d} = {}) => [a, b, c, d]',
    'fn({a: 1, b: 2, c: 3, d: 4})',
    '',
  ].join('\n')
  expect(findRule(lint(code), RULE)).toHaveLength(1)
})

test('rest elements are not counted', () => {
  const code = [
    'const fn = ({a, b, c, ...rest}) => [a, b, c, rest]',
    'fn({a: 1, b: 2, c: 3, d: 4})',
    '',
  ].join('\n')
  expect(findRule(lint(code), RULE)).toHaveLength(0)
})

test('max option is configurable', () => {
  const code = [
    'const fn = ({a, b, c}) => a + b + c',
    'fn({a: 1, b: 2, c: 3})',
    '',
  ].join('\n')
  const hits = findRule(lintAt(code, 2), RULE)
  expect(hits).toHaveLength(1)
  expect(hits[0].message).toContain('max is 2')
})

test('destructuring outside parameters is not counted', () => {
  const code = [
    'const obj = {a: 1, b: 2, c: 3, d: 4}',
    'const {a, b, c, d} = obj',
    'export {a, b, c, d}',
    '',
  ].join('\n')
  expect(findRule(lint(code), RULE)).toHaveLength(0)
})

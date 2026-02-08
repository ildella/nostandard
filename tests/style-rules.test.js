import {createRequire} from 'node:module'

const require = createRequire(import.meta.url)
const {Linter} = require('eslint')
const {nostandard} = require('../lib/main')

const linter = new Linter()
const configs = nostandard()

const lint = code => linter.verify(code, configs)
const findRule = (messages, ruleId) =>
  messages.filter(m => m.ruleId === ruleId)

test('implicit-arrow-linebreak is off (no warnings)', () => {
  const code = 'const fn = () =>\n  1\nfn()\n'
  const messages = lint(code)
  const hits = findRule(
    messages, '@stylistic/js/implicit-arrow-linebreak',
  )
  expect(hits).toHaveLength(0)
})

test('no-confusing-arrow is off (no warnings)', () => {
  const code = 'const fn = a => a ? 1 : 0\nfn(1)\n'
  const messages = lint(code)
  const hits = findRule(
    messages, '@stylistic/js/no-confusing-arrow',
  )
  expect(hits).toHaveLength(0)
})

test('no-extra-parens warns on unnecessary parens', () => {
  const code = 'const x = (1 + 2)\n'
  const messages = lint(code)
  const hits = findRule(
    messages, '@stylistic/js/no-extra-parens',
  )
  expect(hits).toHaveLength(1)
})

test('no-extra-parens allows nested binary expressions', () => {
  const code = 'const x = (1 + 2) * 3\n'
  const messages = lint(code)
  const hits = findRule(
    messages, '@stylistic/js/no-extra-parens',
  )
  expect(hits).toHaveLength(0)
})

test('function-paren-newline warns on inconsistent parens', () => {
  const code = 'const fn = (a, b\n) => a + b\nfn(1, 2)\n'
  const messages = lint(code)
  const hits = findRule(
    messages, '@stylistic/js/function-paren-newline',
  )
  expect(hits).toHaveLength(1)
})

test('nonblock-statement-body-position warns on beside', () => {
  const code = 'const x = 1\nif (x) console.log(x)\n'
  const messages = lint(code)
  const hits = findRule(
    messages,
    '@stylistic/js/nonblock-statement-body-position',
  )
  expect(hits).toHaveLength(1)
  expect(hits[0].severity).toBe(1)
})

test('multiline-ternary allows always-multiline', () => {
  const code = [
    'const x = true',
    'const y = x',
    '  ? 1',
    '  : 0',
    '',
  ].join('\n')
  const messages = lint(code)
  const hits = findRule(
    messages, '@stylistic/js/multiline-ternary',
  )
  expect(hits).toHaveLength(0)
})

test('object-curly-newline enforces minProperties 3', () => {
  const code = 'const obj = { a: 1, b: 2, c: 3 }\n'
  const messages = lint(code)
  const hits = findRule(
    messages, '@stylistic/js/object-curly-newline',
  )
  expect(hits.length).toBeGreaterThan(0)
})

test('max-len warns at 90 characters', () => {
  const longLine = `const x = '${'a'.repeat(85)}'\n`
  const messages = lint(longLine)
  const hits = findRule(messages, '@stylistic/js/max-len')
  expect(hits).toHaveLength(1)
})

test('max-len does not warn under 90 characters', () => {
  const shortLine = `const x = '${'a'.repeat(75)}'\n`
  const messages = lint(shortLine)
  const hits = findRule(messages, '@stylistic/js/max-len')
  expect(hits).toHaveLength(0)
})

import {createRequire} from 'node:module'

const require = createRequire(import.meta.url)
const {Linter} = require('eslint')
const nostandard = require('../index')

const linter = new Linter()
const configs = [nostandard.configs.base]

const lint = code => linter.verify(code, configs)
const findRule = (messages, ruleId) =>
  messages.filter(m => m.ruleId === ruleId)

test('no-undefined fires as error', () => {
  const messages = lint('const x = undefined\n')
  const hits = findRule(messages, 'no-undefined')
  expect(hits).toHaveLength(1)
  expect(hits[0].severity).toBe(2)
})

test('no-inner-declarations warns in non-strict script mode', () => {
  const scriptLinter = new Linter()
  const scriptConfigs = [nostandard.configs.base].map(config => ({
    ...config,
    languageOptions: {
      ...config.languageOptions,
      sourceType: 'script',
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        ecmaFeatures: {impliedStrict: false},
      },
    },
  }))
  const code = 'if (true) {\n  function foo () {}\n}\n'
  const messages = scriptLinter.verify(code, scriptConfigs)
  const hits = findRule(messages, 'no-inner-declarations')
  expect(hits).toHaveLength(1)
  expect(hits[0].severity).toBe(1)
})

test('no-return-assign warns on assignment without parens', () => {
  const code = [
    'const fn = a => { let b; return b = a }',
    'fn(1)',
    '',
  ].join('\n')
  const messages = lint(code)
  const hits = findRule(messages, 'no-return-assign')
  expect(hits).toHaveLength(1)
  expect(hits[0].severity).toBe(1)
})

test('no-return-assign allows assignment in parens', () => {
  const code = [
    'const fn = a => { let b; return (b = a) }',
    'fn(1)',
    '',
  ].join('\n')
  const messages = lint(code)
  const hits = findRule(messages, 'no-return-assign')
  expect(hits).toHaveLength(0)
})

test('camelcase warns on snake_case', () => {
  const messages = lint('const my_var = 1\nmy_var\n')
  const hits = findRule(messages, 'camelcase')
  expect(hits.length).toBeGreaterThan(0)
  expect(hits[0].severity).toBe(1)
})

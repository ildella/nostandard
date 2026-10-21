import {Linter} from 'eslint'
import {nostandard} from '../src/index.js'
import {plugin} from '../src/rules/index.js'

const RULE = 'nostandard/restricted-syntax'
const RESOLVED_NULL = 'export const a = () => Promise.resolve(null)\n'

const linter = new Linter()
const lint = code => linter.verify(code, [nostandard.base])
const findRule = (messages, ruleId = RULE) =>
  messages.filter(m => m.ruleId === ruleId)

test('the plugin exports the rule', () => {
  expect(plugin.rules['restricted-syntax']).toBeDefined()
})

test('the base config enables it as warn', () => {
  const [severity] = nostandard.base.rules[RULE]
  expect(severity).toBe('warn')
})

test('class getters and setters are reported', () => {
  const code = [
    'class Temperature {',
    '  constructor (celsius) {',
    '    this.celsius = celsius',
    '  }',
    '  get fahrenheit () {',
    '    return this.celsius * 2',
    '  }',
    '  set fahrenheit (value) {',
    '    this.celsius = value',
    '  }',
    '}',
    'export {Temperature}',
    '',
  ].join('\n')
  const hits = findRule(lint(code))
  expect(hits).toHaveLength(2)
  expect(hits[0].message).toContain('Getters are forbidden')
})

test('object getters and setters are reported', () => {
  const code = [
    'const config = {',
    '  value: 1,',
    '  get double () {',
    '    return this.value * 2',
    '  },',
    '  set double (next) {',
    '    this.value = next',
    '  },',
    '}',
    'export {config}',
    '',
  ].join('\n')
  expect(findRule(lint(code))).toHaveLength(2)
})

test('spying on console is reported', () => {
  const code = [
    'export const spy = () => spyOn(console, \'log\')',
    '',
  ].join('\n')
  const hits = findRule(lint(code))
  expect(hits).toHaveLength(1)
  expect(hits[0].message).toContain('console logs')
})

test('jest.spyOn on console is reported once', () => {
  const code = [
    'export const spy = () => jest.spyOn(console, \'log\')',
    '',
  ].join('\n')
  expect(findRule(lint(code))).toHaveLength(1)
})

test('Promise.resolve(null) is reported', () => {
  const code = 'export const empty = () => Promise.resolve(null)\n'
  const hits = findRule(lint(code))
  expect(hits).toHaveLength(1)
  expect(hits[0].message).toContain('Only losers')
})

test('Promise.resolve with a value is allowed', () => {
  const code = 'export const one = () => Promise.resolve(1)\n'
  expect(findRule(lint(code))).toHaveLength(0)
})

test('dynamic import is not reported by this rule', () => {
  const code = 'export const load = path => import(path)\n'
  expect(findRule(lint(code))).toHaveLength(0)
})

test('a project can keep its own no-restricted-syntax', () => {
  const base = nostandard.base
  const messages = linter.verify(RESOLVED_NULL, [{
    ...base,
    rules: {
      ...base.rules,
      'no-restricted-syntax': ['error', 'DebuggerStatement'],
    },
  }])
  expect(findRule(messages)).toHaveLength(1)
  expect(findRule(messages, 'no-restricted-syntax')).toHaveLength(0)
})

test('string options fall back to a generated message', () => {
  const base = nostandard.base
  const messages = linter.verify('debugger\n', [{
    ...base,
    rules: {
      ...base.rules,
      [RULE]: ['warn', 'DebuggerStatement'],
    },
  }])
  const hits = findRule(messages)
  expect(hits).toHaveLength(1)
  expect(hits[0].message).toBe('Using \'DebuggerStatement\' is not allowed.')
})

test('the rule can be turned off per project', () => {
  const base = nostandard.base
  const messages = linter.verify(RESOLVED_NULL, [
    {...base, rules: {...base.rules, [RULE]: 'off'}},
  ])
  expect(findRule(messages)).toHaveLength(0)
})

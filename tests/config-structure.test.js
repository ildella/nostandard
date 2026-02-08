import {createRequire} from 'node:module'

const require = createRequire(import.meta.url)
const {nostandard} = require('../lib/main')

test('nostandard() returns 2 configs: base + style', () => {
  const configs = nostandard()
  expect(configs).toHaveLength(2)
  expect(configs[0].name).toBe('nostandard/base')
  expect(configs[1].name).toBe('nostandard/style')
})

test('nostandard({noStyle: true}) returns 1 config: base only', () => {
  const configs = nostandard({noStyle: true})
  expect(configs).toHaveLength(1)
  expect(configs[0].name).toBe('nostandard/base')
})

test('nostandard({ignores}) prepends ignores config', () => {
  const configs = nostandard({
    ignores: ['dist/**',
      'build/**'],
  })
  expect(configs).toHaveLength(3)
  expect(configs[0]).toEqual({
    ignores: ['dist/**',
      'build/**'],
  })
  expect(configs[0].name).toBeUndefined()
  expect(configs[1].name).toBe('nostandard/base')
  expect(configs[2].name).toBe('nostandard/style')
})

test('nostandard() with no args does not prepend ignores', () => {
  const configs = nostandard()
  expect(configs[0].name).toBe('nostandard/base')
})

test('base config has languageOptions with globals', () => {
  const [base] = nostandard()
  expect(base.languageOptions).toBeDefined()
  expect(base.languageOptions.globals).toBeDefined()
})

test('base config includes eslint recommended rules', () => {
  const [base] = nostandard()
  expect(base.rules['no-undef']).toBe('error')
})

test('style config has @stylistic/js plugin', () => {
  const [, style] = nostandard()
  expect(style.plugins['@stylistic/js']).toBeDefined()
})

test('base: no-undefined is error', () => {
  const [base] = nostandard()
  expect(base.rules['no-undefined']).toBe('error')
})

test('base: no-return-assign is warn with except-parens', () => {
  const [base] = nostandard()
  expect(base.rules['no-return-assign']).toEqual(
    ['warn',
      'except-parens'],
  )
})

test('base: no-inner-declarations is warn', () => {
  const [base] = nostandard()
  expect(base.rules['no-inner-declarations']).toBe('warn')
})

test('style: implicit-arrow-linebreak is off', () => {
  const [, style] = nostandard()
  expect(
    style.rules['@stylistic/js/implicit-arrow-linebreak'],
  ).toBe('off')
})

test('style: no-confusing-arrow is off', () => {
  const [, style] = nostandard()
  expect(
    style.rules['@stylistic/js/no-confusing-arrow'],
  ).toBe('off')
})

test('style: function-paren-newline is consistent', () => {
  const [, style] = nostandard()
  expect(
    style.rules['@stylistic/js/function-paren-newline'],
  ).toEqual(['warn',
    'consistent'])
})

test('style: nonblock-statement-body-position is warn below', () => {
  const [, style] = nostandard()
  expect(
    style.rules['@stylistic/js/nonblock-statement-body-position'],
  ).toEqual(['warn',
    'below'])
})

test('style: no-extra-parens is warn with nestedBinaryExpressions off', () => {
  const [, style] = nostandard()
  expect(
    style.rules['@stylistic/js/no-extra-parens'],
  ).toEqual(['warn',
    'all',
    {nestedBinaryExpressions: false}])
})

test('style: max-len defaults to 90', () => {
  const [, style] = nostandard()
  const maxLen = style.rules['@stylistic/js/max-len']
  expect(maxLen[1].code).toBe(90)
})

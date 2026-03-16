import {nostandard} from '../src/index.js'

test('configs.base exists', () => {
  expect(nostandard.base).toBeDefined()
  expect(nostandard.base.name).toBe('nostandard/base')
})

test('configs.style exists', () => {
  expect(nostandard.style).toBeDefined()
  expect(nostandard.style.name).toBe('nostandard/style')
})

test('configs.recommended is [base, style]', () => {
  expect(nostandard.recommended).toHaveLength(2)
  expect(nostandard.recommended[0]).toBe(nostandard.base)
  expect(nostandard.recommended[1]).toBe(nostandard.style)
})

test('base config has languageOptions with globals', () => {
  const {base} = nostandard
  expect(base.languageOptions).toBeDefined()
  expect(base.languageOptions.globals).toBeDefined()
})

test('base config includes eslint recommended rules', () => {
  const {base} = nostandard
  expect(base.rules['no-undef']).toBe('error')
})

test('style config has @stylistic/js plugin', () => {
  const {style} = nostandard
  expect(style.plugins['@stylistic/js']).toBeDefined()
})

test('base: no-undefined is error', () => {
  const {base} = nostandard
  expect(base.rules['no-undefined']).toBe('error')
})

test('base: no-return-assign is warn with except-parens', () => {
  const {base} = nostandard
  expect(base.rules['no-return-assign']).toEqual(
    ['warn',
      'except-parens'],
  )
})

test('base: no-inner-declarations is warn', () => {
  const {base} = nostandard
  expect(base.rules['no-inner-declarations']).toBe('warn')
})

test('style: implicit-arrow-linebreak is off', () => {
  const {style} = nostandard
  expect(
    style.rules['@stylistic/js/implicit-arrow-linebreak'],
  ).toBe('off')
})

test('style: no-confusing-arrow is off', () => {
  const {style} = nostandard
  expect(
    style.rules['@stylistic/js/no-confusing-arrow'],
  ).toBe('off')
})

test('style: function-paren-newline is consistent', () => {
  const {style} = nostandard
  expect(
    style.rules['@stylistic/js/function-paren-newline'],
  ).toEqual(['warn',
    'consistent'])
})

test('style: nonblock-statement-body-position is warn below', () => {
  const {style} = nostandard
  expect(
    style.rules['@stylistic/js/nonblock-statement-body-position'],
  ).toEqual(['warn',
    'below'])
})

test('style: no-extra-parens is warn with nestedBinaryExpressions off', () => {
  const {style} = nostandard
  expect(
    style.rules['@stylistic/js/no-extra-parens'],
  ).toEqual(['warn',
    'all',
    {nestedBinaryExpressions: false}])
})

test('style: max-len defaults to 90', () => {
  const {style} = nostandard
  const maxLen = style.rules['@stylistic/js/max-len']
  expect(maxLen[1].code).toBe(90)
})

import {createRequire} from 'node:module'

const require = createRequire(import.meta.url)
const nostandard = require('../index')

test('configs.base exists', () => {
  expect(nostandard.configs.base).toBeDefined()
  expect(nostandard.configs.base.name).toBe('nostandard/base')
})

test('configs.style exists', () => {
  expect(nostandard.configs.style).toBeDefined()
  expect(nostandard.configs.style.name).toBe('nostandard/style')
})

test('configs.recommended is [base, style]', () => {
  expect(nostandard.configs.recommended).toHaveLength(2)
  expect(nostandard.configs.recommended[0]).toBe(nostandard.configs.base)
  expect(nostandard.configs.recommended[1]).toBe(nostandard.configs.style)
})

test('base config has languageOptions with globals', () => {
  const {base} = nostandard.configs
  expect(base.languageOptions).toBeDefined()
  expect(base.languageOptions.globals).toBeDefined()
})

test('base config includes eslint recommended rules', () => {
  const {base} = nostandard.configs
  expect(base.rules['no-undef']).toBe('error')
})

test('style config has @stylistic/js plugin', () => {
  const {style} = nostandard.configs
  expect(style.plugins['@stylistic/js']).toBeDefined()
})

test('base: no-undefined is error', () => {
  const {base} = nostandard.configs
  expect(base.rules['no-undefined']).toBe('error')
})

test('base: no-return-assign is warn with except-parens', () => {
  const {base} = nostandard.configs
  expect(base.rules['no-return-assign']).toEqual(
    ['warn',
      'except-parens'],
  )
})

test('base: no-inner-declarations is warn', () => {
  const {base} = nostandard.configs
  expect(base.rules['no-inner-declarations']).toBe('warn')
})

test('style: implicit-arrow-linebreak is off', () => {
  const {style} = nostandard.configs
  expect(
    style.rules['@stylistic/js/implicit-arrow-linebreak'],
  ).toBe('off')
})

test('style: no-confusing-arrow is off', () => {
  const {style} = nostandard.configs
  expect(
    style.rules['@stylistic/js/no-confusing-arrow'],
  ).toBe('off')
})

test('style: function-paren-newline is consistent', () => {
  const {style} = nostandard.configs
  expect(
    style.rules['@stylistic/js/function-paren-newline'],
  ).toEqual(['warn',
    'consistent'])
})

test('style: nonblock-statement-body-position is warn below', () => {
  const {style} = nostandard.configs
  expect(
    style.rules['@stylistic/js/nonblock-statement-body-position'],
  ).toEqual(['warn',
    'below'])
})

test('style: no-extra-parens is warn with nestedBinaryExpressions off', () => {
  const {style} = nostandard.configs
  expect(
    style.rules['@stylistic/js/no-extra-parens'],
  ).toEqual(['warn',
    'all',
    {nestedBinaryExpressions: false}])
})

test('style: max-len defaults to 90', () => {
  const {style} = nostandard.configs
  const maxLen = style.rules['@stylistic/js/max-len']
  expect(maxLen[1].code).toBe(90)
})

test('configs.svelte is an array', () => {
  const {svelte} = nostandard.configs
  expect(Array.isArray(svelte)).toBe(true)
  expect(svelte.length).toBeGreaterThanOrEqual(2)
})

test('configs.svelte last element is nostandard/svelte', () => {
  const {svelte} = nostandard.configs
  const custom = svelte.at(-1)
  expect(custom.name).toBe('nostandard/svelte')
})

test('svelte config targets .svelte and .svelte.js', () => {
  const {svelte} = nostandard.configs
  const custom = svelte.at(-1)
  expect(custom.files).toEqual(
    ['**/*.svelte', '**/*.svelte.js'],
  )
})

test('svelte config has custom svelte rules', () => {
  const {svelte} = nostandard.configs
  const custom = svelte.at(-1)
  expect(
    custom.rules['svelte/html-closing-bracket-new-line'],
  ).toBeDefined()
  expect(
    custom.rules['svelte/indent'],
  ).toBeDefined()
  expect(
    custom.rules['svelte/max-attributes-per-line'],
  ).toBeDefined()
  expect(
    custom.rules['svelte/no-dom-manipulating'],
  ).toBe('error')
})

test('svelte config overrides base rules for svelte context', () => {
  const {svelte} = nostandard.configs
  const custom = svelte.at(-1)
  expect(custom.rules['no-return-assign']).toBe('off')
  expect(custom.rules['prefer-const']).toBe('off')
  expect(
    custom.rules['@stylistic/js/indent'],
  ).toBe('off')
  expect(
    custom.rules['@stylistic/js/max-len'],
  ).toBe('error')
})

test('configs.vitest exists and is named', () => {
  const {vitest} = nostandard.configs
  expect(vitest).toBeDefined()
  expect(vitest.name).toBe('nostandard/vitest')
})

test('vitest config targets test files', () => {
  const {vitest} = nostandard.configs
  expect(vitest.files).toEqual(
    ['tests/**/*.js', '**/*.test.js'],
  )
})

test('vitest config has vitest plugin', () => {
  const {vitest} = nostandard.configs
  expect(vitest.plugins.vitest).toBeDefined()
})

test('vitest config disables no-undefined', () => {
  const {vitest} = nostandard.configs
  expect(vitest.rules['no-undefined']).toBe('off')
})

test('vitest config provides test globals', () => {
  const {vitest} = nostandard.configs
  const globals = vitest.languageOptions.globals
  expect(globals.test).toBeDefined()
  expect(globals.expect).toBeDefined()
  expect(globals.vi).toBeDefined()
  expect(globals.beforeAll).toBeDefined()
})

test('vitest config has custom rule overrides', () => {
  const {vitest} = nostandard.configs
  expect(
    vitest.rules['vitest/prefer-expect-resolves'],
  ).toBe('warn')
  expect(
    vitest.rules['vitest/no-commented-out-tests'],
  ).toBe('warn')
  expect(
    vitest.rules['vitest/max-nested-describe'],
  ).toEqual(['error', {max: 1}])
})

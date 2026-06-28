import importXConfig from '../src/configs/import-x.js'

test('import-x config has correct name', () => {
  expect(importXConfig.name).toBe('nostandard/import-x')
})

test('import-x config registers the import-x plugin', () => {
  expect(importXConfig.plugins).toBeDefined()
  expect(importXConfig.plugins['import-x']).toBeDefined()
})

test('import-x config targets source and test files', () => {
  expect(importXConfig.files).toEqual([
    'src/**/*.js',
    'src/**/*.svelte*',
    'tests/**/*.js',
  ])
})

test('import-x config configures extensions', () => {
  expect(importXConfig.settings['import-x/extensions']).toEqual([
    '.js',
    '.svelte',
    '.svelte.js',
  ])
})

test('import-x: unresolved and cycle checks are off', () => {
  expect(importXConfig.rules['import-x/no-unresolved']).toBe('off')
  expect(importXConfig.rules['import-x/no-cycle']).toBe('off')
})

test('import-x: order and max-dependencies are warned', () => {
  expect(importXConfig.rules['import-x/order']).toBe('warn')
  expect(importXConfig.rules['import-x/max-dependencies']).toBeDefined()
})

test('import-x: mutable exports and self import are errors', () => {
  expect(importXConfig.rules['import-x/no-mutable-exports']).toBe('error')
  expect(importXConfig.rules['import-x/no-self-import']).toBe('error')
  expect(importXConfig.rules['import-x/no-duplicates']).toBe('error')
})

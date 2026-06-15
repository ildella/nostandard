import sonarjsConfig from '../src/configs/sonarjs.js'

test('sonarjs config has correct name', () => {
  expect(sonarjsConfig.name).toBe('nostandard/sonarjs')
})

test('sonarjs config registers the sonarjs plugin', () => {
  expect(sonarjsConfig.plugins).toBeDefined()
  expect(sonarjsConfig.plugins.sonarjs).toBeDefined()
})

test('sonarjs: recommended rules are loaded', () => {
  expect(sonarjsConfig.rules['sonarjs/cognitive-complexity']).toBeDefined()
})

test('sonarjs: todo-tag is off', () => {
  expect(sonarjsConfig.rules['sonarjs/todo-tag']).toBe('off')
})

test('sonarjs: complexity overrides match nucube overrides', () => {
  expect(sonarjsConfig.rules['sonarjs/cyclomatic-complexity']).toEqual([
    'warn',
    {threshold: 8},
  ])
  expect(sonarjsConfig.rules['sonarjs/expression-complexity']).toEqual([
    'warn',
    {max: 3},
  ])
})

test('sonarjs: unused-import is off, no-unused-vars is warn', () => {
  expect(sonarjsConfig.rules['sonarjs/unused-import']).toBe('off')
  expect(sonarjsConfig.rules['sonarjs/no-unused-vars']).toBe('warn')
})

test(
  'sonarjs: dead-store, identical-functions, and commented-code are warned',
  () => {
    expect(sonarjsConfig.rules['sonarjs/no-dead-store']).toBe('warn')
    expect(sonarjsConfig.rules['sonarjs/no-identical-functions']).toBe('warn')
    expect(sonarjsConfig.rules['sonarjs/no-commented-code']).toBe('warn')
  },
)

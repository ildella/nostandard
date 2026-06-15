import functionalUnicornConfig from '../src/configs/functional-unicorn.js'

const pluginsConfig = functionalUnicornConfig.find(
  config => config.name === 'nostandard/functional-unicorn/plugins',
)
const rulesConfig = functionalUnicornConfig.find(
  config => config.name === 'nostandard/functional-unicorn/rules',
)

test('functional-unicorn config is an array', () => {
  expect(Array.isArray(functionalUnicornConfig)).toBe(true)
  expect(functionalUnicornConfig).toHaveLength(2)
})

test('functional-unicorn plugins config registers plugins globally', () => {
  expect(pluginsConfig.plugins).toBeDefined()
  expect(pluginsConfig.plugins.functional).toBeDefined()
  expect(pluginsConfig.plugins.unicorn).toBeDefined()
})

test('functional-unicorn rules config targets source files', () => {
  expect(rulesConfig.files).toEqual(['src/**/*.js'])
})

test('functional-unicorn: functional recommended rules are loaded', () => {
  const {rules} = rulesConfig
  expect(rules['functional/no-let']).toBe('warn')
  expect(rules['functional/no-loop-statements']).toBe('off')
  expect(rules['functional/no-this-expressions']).toBe('warn')
  expect(rules['functional/no-try-statements']).toBe('off')
})

test('functional-unicorn: pipelean rules are not included', () => {
  const {rules} = rulesConfig
  expect(rules['pipelean/no-array-foreach']).toBeUndefined()
  expect(rules['pipelean/no-array-map-async']).toBeUndefined()
  expect(rules['pipelean/no-array-reduce']).toBeUndefined()
  expect(rules['pipelean/no-loop-without-yield']).toBeUndefined()
  expect(rules['pipelean/no-promise-combinators']).toBeUndefined()
})

test('functional-unicorn: unicorn overrides are loaded', () => {
  const {rules} = rulesConfig
  expect(rules['unicorn/import-style']).toBe('off')
  expect(rules['unicorn/no-array-for-each']).toBe('off')
  expect(rules['unicorn/no-array-reduce']).toBe('off')
  expect(rules['unicorn/no-null']).toBe('warn')
  expect(rules['unicorn/prefer-node-protocol']).toBe('warn')
})

test(
  'functional-unicorn: import-x/no-nodejs-modules is enforced',
  () => {
    expect(rulesConfig.rules['import-x/no-nodejs-modules']).toBe('error')
  },
)

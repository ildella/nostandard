import {readFileSync} from 'node:fs'
import {URL} from 'node:url'
import config from '../src/configs/functional-typed.js'
import {nostandard} from '../src/index.js'

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
)

test('functional-typed config has correct name', () => {
  expect(config.name).toBe('nostandard/functional-typed')
})

test('functional-typed targets only js, mjs and cjs files', () => {
  expect(config.files).toEqual(['**/*.{js,mjs,cjs}'])
})

test('functional-typed uses the typescript-eslint parser', () => {
  expect(config.languageOptions.parser.meta.name).toBe(
    'typescript-eslint/parser',
  )
  expect(config.languageOptions.parserOptions.projectService).toBe(true)
})

test('functional-typed enables immutable-data at warn', () => {
  expect(config.rules['functional/immutable-data']).toBe('warn')
})

test('functional-typed does not enable the heavy type-aware rules', () => {
  expect(
    config.rules['functional/no-expression-statements'],
  ).toBeUndefined()
  expect(
    config.rules['functional/prefer-immutable-types'],
  ).toBeUndefined()
})

test('functional-typed is not part of recommended', () => {
  expect(nostandard.recommended).not.toContain(config)
})

test('functional-typed is exported from the package', () => {
  expect(pkg.exports['./functional-typed']).toBe(
    './src/configs/functional-typed.js',
  )
})

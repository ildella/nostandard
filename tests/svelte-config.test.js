import svelte from '../src/configs/svelte.js'
import {promiseSyntaxList} from '../src/configs/restricted-syntax.js'

const RULE = 'nostandard/restricted-syntax'

test('svelte config is an array with nostandard config', () => {
  const config = svelte.at(-1)
  expect(config.name).toBe('nostandard/svelte')
})

test('svelte: rules are loaded', () => {
  const {rules} = svelte.at(-1)
  expect(rules['svelte/no-dom-manipulating']).toBe('error')
  expect(rules['no-return-assign']).toBe('off')
})

test('svelte: files cover svelte, svelte.js and svelte.ts', () => {
  expect(svelte.at(-1).files).toEqual([
    '**/*.svelte',
    '**/*.svelte.js',
    '**/*.svelte.ts',
  ])
})

test('svelte: the nostandard plugin is registered', () => {
  expect(svelte.at(-1).plugins.nostandard).toBeDefined()
})

test('svelte: restricted-syntax keeps only the Promise ban', () => {
  const [severity, ...selectors] = svelte.at(-1).rules[RULE]
  expect(severity).toBe('warn')
  expect(selectors).toEqual(promiseSyntaxList)
  expect(selectors).toHaveLength(1)
})

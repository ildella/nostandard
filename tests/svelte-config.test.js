import svelte from '../src/configs/svelte.js'

test('svelte config is an array with nostandard config', () => {
  const config = svelte.at(-1)
  expect(config.name).toBe('nostandard/svelte')
})

test('svelte: rules are loaded', () => {
  const {rules} = svelte.at(-1)
  expect(rules['svelte/no-dom-manipulating']).toBe('error')
  expect(rules['no-return-assign']).toBe('off')
})

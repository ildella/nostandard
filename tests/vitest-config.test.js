import vitestConfig from '../src/configs/vitest.js'

test('vitest config has correct name', () => {
  expect(vitestConfig.name).toBe('nostandard/vitest')
})

test('vitest: rules are loaded', () => {
  expect(vitestConfig.rules['vitest/prefer-expect-resolves']).toBe('warn')
  expect(vitestConfig.rules['no-undefined']).toBe('off')
})

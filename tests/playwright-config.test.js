import playwrightConfig from '../src/configs/playwright.js'

test('playwright config has correct name', () => {
  expect(playwrightConfig.name).toBe('nostandard/playwright')
})

test('playwright config registers the playwright plugin', () => {
  expect(playwrightConfig.plugins).toBeDefined()
  expect(playwrightConfig.plugins.playwright).toBeDefined()
})

test('playwright config targets e2e files', () => {
  expect(playwrightConfig.files).toContain('e2e/**/*.*js')
})

test('playwright: recommended rules are loaded', () => {
  expect(playwrightConfig.rules['playwright/no-focused-test']).toBeDefined()
})

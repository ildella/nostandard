const RECOMMENDED_FILES = {
  'src/main.js': `var user_name = 1

export {user_name}
`,
}

const FUNCTIONAL_FILES = {
  'src/main.js': `let counter = 0
counter += 1

export const get_count = () => counter
`,
}

const UNICORN_FILES = {
  'src/main.js': `export const get_value = () => null
`,
}

const VITEST_FILES = {
  'tests/a.test.js': `const my_case = 1

test('adds', () => {
  expect(my_case).toBe(1)
})

test.skip('later', () => {
  expect(1).toBe(2)
})
`,
}

const IMPORT_X_FILES = {
  'src/dep.js': `export const value = 1
`,
  'src/app.js': `import {value} from './dep.js'
import {readFile} from 'node:fs/promises'

export let counter = readFile(value)
`,
}

const SONARJS_FILES = {
  'src/main.js': `export const overwrite = () => {
  const list = [1, 2, 3]
  list[0] = 4
  list[0] = 5
  return list
}

export const get_value = () => overwrite()[0]
`,
}

const PLAYWRIGHT_FILES = {
  'e2e/a.spec.js': `/* global test:readonly, expect:readonly */
const my_case = 'title'

test.only('loads', async ({page}) => {
  await expect(page).toHaveTitle(my_case)
})
`,
}

const SVELTE_FILES = {
  'Comp.svelte': `<script>
  var old = 1
</script>

<div>hello</div>
`,
  'Comp.svelte.js': `var old = 1
`,
  'bad.js': `var bad = 1

export {bad}
`,
}

export const SCENARIOS = [
  {name: 'recommended', slice: 'recommended', files: RECOMMENDED_FILES},
  {name: 'functional', slice: 'functional', files: FUNCTIONAL_FILES},
  {name: 'unicorn', slice: 'unicorn', files: UNICORN_FILES},
  {name: 'vitest', slice: 'vitest', files: VITEST_FILES},
  {name: 'import-x', slice: 'importX', files: IMPORT_X_FILES},
  {name: 'sonarjs', slice: 'sonarjs', files: SONARJS_FILES},
  {name: 'playwright', slice: 'playwright', files: PLAYWRIGHT_FILES},
  {
    name: 'svelte',
    slice: 'svelte',
    svelte: true,
    files: SVELTE_FILES,
  },
]

export const REPO_SCENARIO = {
  name: 'repo',
  slice: 'recommended',
  repo: true,
}

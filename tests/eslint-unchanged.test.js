import {existsSync, readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {snapshot} from './support/eslint-snapshot.js'

const FIXTURE = fileURLToPath(
  new globalThis.URL(
    './fixtures/eslint-exports.snapshot.json',
    import.meta.url,
  ),
)
const MISSING =
  'snapshot missing; run yarn snapshot:eslint and commit the result'
const MESSAGE =
  'ESLint export changed; do not update this snapshot to accomodate Oxlint'

test('ESLint public exports are frozen', () => {
  if (!existsSync(FIXTURE))
    throw new Error(MISSING)
  expect(snapshot(), MESSAGE).toEqual(JSON.parse(readFileSync(FIXTURE, 'utf8')))
})

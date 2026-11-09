import {writeFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import {snapshot} from '../tests/support/eslint-snapshot.js'

const FIXTURE = fileURLToPath(
  new globalThis.URL(
    '../tests/fixtures/eslint-exports.snapshot.json',
    import.meta.url,
  ),
)

await writeFile(FIXTURE, `${JSON.stringify(snapshot(), null, 2)}\n`)

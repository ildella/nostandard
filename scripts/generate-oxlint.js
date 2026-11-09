import {rm} from 'node:fs/promises'
import process from 'node:process'
import {join} from 'node:path'
import {
  URL,
  fileURLToPath,
  pathToFileURL,
} from 'node:url'
import {SLICE_FILE, SLICES} from '../src/oxlint/slices.js'
import {OFFSET_FILES, SVELTE_IGNORES} from '../src/oxlint/file-scope.js'
import {postProcess} from '../src/oxlint/post-process.js'
import {checkPartition, enabledByScope} from '../src/oxlint/partition.js'
import {GENERATED_DIR, TEMP_ROOT, prepareDir} from './oxlint-io.js'
import {
  ensureGeneratedDir,
  readJson,
  summarize,
  writeJson,
  writeText,
} from './oxlint-io.js'
import {parseUnmigrated, runMigrate} from './oxlint-migrate.js'

const CONFIG_FILE = 'config.mjs'
const OXLINT_FILE = 'oxlint.json'
const SLICES_URL = pathToFileURL(
  fileURLToPath(
    new URL('../src/oxlint/slices.js', import.meta.url),
  ),
).href

const configSource = key => [
  `import {SLICES} from '${SLICES_URL}'`,
  '',
  `export default SLICES.${key}`,
  '',
].join('\n')

const OFF = 'off'
const SEPARATOR = '\u0000'

const filesKey = files => files === null
  ? ''
  : [...files].sort().join(SEPARATOR)

const mergeScopes = scopes => {
  const grouped = new Map()
  scopes.forEach(({files, ids}) => {
    const key = filesKey(files)
    const entry = grouped.get(key) ?? {files, ids: new Set()}
    ids.forEach(id => entry.ids.add(id))
    grouped.set(key, entry)
  })
  return [...grouped.values()]
}

const scopeEntry = ({files, ids}) => ({
  files: files === null ? OFFSET_FILES : files,
  ignores: SVELTE_IGNORES,
  rules: Object.fromEntries([...ids].sort().map(id => [id, OFF])),
})

const entryKey = entry => entry.files.join(SEPARATOR)

const offSet = config => mergeScopes(enabledByScope(config))
  .map(scopeEntry)
  .sort((left, right) => entryKey(left).localeCompare(entryKey(right)))

const generateSlice = async key => {
  const stem = SLICE_FILE[key]
  const dir = await prepareDir(stem)
  await writeText(join(dir, CONFIG_FILE), configSource(key))
  const details = await runMigrate(dir, CONFIG_FILE, OXLINT_FILE)
  const config = postProcess(await readJson(join(dir, OXLINT_FILE)))
  const partition = checkPartition(SLICES[key], config)
  await writeJson(join(GENERATED_DIR, `${stem}.oxlint.json`), config)
  const offFile = join(GENERATED_DIR, `${stem}.eslint-off.json`)
  await writeJson(offFile, offSet(config))
  return {...partition, stem, unmigrated: parseUnmigrated(details)}
}

const main = async () => {
  await ensureGeneratedDir()
  const keys = Object.keys(SLICES)
  const results = await Promise.all(keys.map(generateSlice))
  const unmigrated = Object.fromEntries(
    results.map(({stem, unmigrated: ids}) => [stem, ids]),
  )
  await writeJson(join(GENERATED_DIR, 'unmigrated.json'), unmigrated)
  results.forEach(summarize)
}

const cleanup = () => rm(TEMP_ROOT, {recursive: true, force: true})

const run = async () => {
  try {
    await main()
    await cleanup()
  } catch (error) {
    process.stdout.write(`temp dir kept at ${TEMP_ROOT}\n`)
    throw error
  }
}

await run()

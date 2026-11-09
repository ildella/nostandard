import {
  mkdir,
  mkdtemp,
  readFile,
  writeFile,
} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import process from 'node:process'
import {
  URL,
  fileURLToPath,
} from 'node:url'

export const TEMP_ROOT = await mkdtemp(
  join(tmpdir(), 'nostandard-generate-'),
)

export const GENERATED_DIR = fileURLToPath(
  new URL('../src/generated/', import.meta.url),
)

const isObject = value =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const sortDeep = value => {
  if (Array.isArray(value))
    return value.map(sortDeep)
  if (!isObject(value))
    return value
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map(key => [key, sortDeep(value[key])]),
  )
}

export const writeText = (path, text) => writeFile(path, text)

export const ensureGeneratedDir = () =>
  mkdir(GENERATED_DIR, {recursive: true})

export const writeJson = (path, value) =>
  writeFile(path, `${JSON.stringify(sortDeep(value), null, 2)}\n`)

export const readJson = async path =>
  JSON.parse(await readFile(path, 'utf8'))

export const prepareDir = async stem => {
  const dir = join(TEMP_ROOT, stem)
  await mkdir(dir, {recursive: true})
  return dir
}

export const summarize = result => process.stdout.write(
  `${result.stem}: oxlint ${result.oxlintIds.length}, ` +
  `remainder ${result.remainder.length}, ` +
  `unmigrated ${result.unmigrated.length}\n`,
)

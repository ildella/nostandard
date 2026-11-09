import {execFile} from 'node:child_process'
import {existsSync, readFileSync} from 'node:fs'
import {join} from 'node:path'
import process from 'node:process'
import {
  URL,
  fileURLToPath,
} from 'node:url'
import {promisify} from 'node:util'

const execFileAsync = promisify(execFile)
const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PACKAGE = join(ROOT, 'node_modules', '@oxlint', 'migrate', 'package.json')
const LOCAL_BINS = [
  'node_modules/.bin/oxlint-migrate',
  'node_modules/.bin/migrate',
]
const MIN_INDENT = 6
const MIGRATE_PACKAGE = join(ROOT, 'node_modules', '@oxlint', 'migrate')

const packageBin = () => {
  const {bin} = JSON.parse(readFileSync(PACKAGE, 'utf8'))
  return typeof bin === 'string' ? bin : Object.values(bin)[0]
}

const binFromPackage = () => join(MIGRATE_PACKAGE, packageBin())

export const migrateBinary = () => {
  const local = LOCAL_BINS
    .map(path => join(ROOT, path))
    .find(path => existsSync(path))
  return local ?? binFromPackage()
}

const migrateArgs = (binary, configFile, outputFile) => [
  binary,
  configFile,
  '--js-plugins',
  '--details',
  '--output-file',
  outputFile,
]

export const runMigrate = async (cwd, configFile, outputFile) => {
  const args = migrateArgs(migrateBinary(), configFile, outputFile)
  const {stdout, stderr} = await execFileAsync(process.execPath, args, {
    cwd,
  })
  return `${stdout}${stderr}`
}

const indentOf = line => line.length - line.trimStart().length

const ruleIdOf = line => line
  .trimStart()
  .slice(2)
  .split(':')[0]
  .trim()

const isRuleLine = line =>
  line.trimStart().startsWith('- ') && indentOf(line) >= MIN_INDENT

export const parseUnmigrated = text => {
  const ids = text
    .split('\n')
    .filter(isRuleLine)
    .map(ruleIdOf)
  return [...new Set(ids)].sort()
}

import {execFile} from 'node:child_process'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import process from 'node:process'
import {
  URL,
  fileURLToPath,
} from 'node:url'
import {promisify} from 'node:util'

const execFileAsync = promisify(execFile)
const ROOT = fileURLToPath(new URL('..', import.meta.url))
const MIGRATE_PACKAGE = join(ROOT, 'node_modules', '@oxlint', 'migrate')
const PACKAGE = join(MIGRATE_PACKAGE, 'package.json')
const SKIPPED_HEADER = /^\s*Skipped (\d+) rules?:\s*$/
const GROUP_LINE = /^\s*- (\d+) (.+?)\s*$/
const RULE_LINE = /^\s*- ([^\s:]+)(?::.*)?\s*$/

const packageBin = () => {
  const {bin} = JSON.parse(readFileSync(PACKAGE, 'utf8'))
  return typeof bin === 'string' ? bin : Object.values(bin)[0]
}

export const migrateBinary = () => join(MIGRATE_PACKAGE, packageBin())

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

const headerIndex = lines => lines.findIndex(line =>
  SKIPPED_HEADER.test(line))

const headerCount = line => Number(SKIPPED_HEADER.exec(line)[1])

const blockAfter = (lines, index) => {
  const block = []
  for (const line of lines.slice(index + 1)) {
    if (line.trim() === '')
      break
    block.push(line)
  }
  return block
}

const pushRule = (groups, line) => {
  const rule = RULE_LINE.exec(line)
  const group = groups.at(-1)
  if (!rule || !group)
    throw new Error(`Unrecognised @oxlint/migrate details line: "${line}"`)
  group.ids.push(rule[1])
}

const groupOf = line => {
  const match = GROUP_LINE.exec(line)
  return match === null
    ? null
    : {declared: Number(match[1]), name: match[2], ids: []}
}

const parseGroups = block => block.reduce((groups, line) => {
  const group = groupOf(line)
  if (group !== null)
    return [...groups, group]
  pushRule(groups, line)
  return groups
}, [])

const assertGroupCounts = (groups, expected) => {
  groups.forEach(({declared, name, ids}) => {
    if (ids.length !== declared)
      throw new Error(
        `@oxlint/migrate reported ${declared} "${name}" rules ` +
        `but ${ids.length} were parsed`,
      )
  })
  const total = groups.reduce((sum, {declared}) => sum + declared, 0)
  if (total !== expected)
    throw new Error(
      `@oxlint/migrate reported ${expected} skipped rules ` +
      `but ${total} were parsed`,
    )
}

export const parseUnmigrated = text => {
  const lines = text.split('\n')
  const index = headerIndex(lines)
  if (index === -1)
    return []
  const groups = parseGroups(blockAfter(lines, index))
  assertGroupCounts(groups, headerCount(lines[index]))
  return [...new Set(groups.flatMap(group => group.ids))].sort()
}

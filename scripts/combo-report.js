import console from 'node:console'

const SEVERITY = {1: 'warn', 2: 'error'}
const LIMIT = 10
const NO_ENTRIES = 0
const FIRST = 0

const describe = entry =>
  `x${entry.count} ${entry.ruleId} (${SEVERITY[entry.severity]}) ${entry.file}`

const printEntries = (label, entries) => {
  if (entries.length === NO_ENTRIES)
    return
  console.log(`  ${label}: ${entries.length} key(s)`)
  entries.slice(FIRST, LIMIT).forEach(entry =>
    console.log(`    ${describe(entry)}`))
}

const describeLine = entry =>
  `${entry.ruleId} (${SEVERITY[entry.severity]}) ${entry.file} ` +
  `baseline ${entry.baselineLines.join(',')} ` +
  `combo ${entry.comboLines.join(',')}`

const printLines = (label, entries) => {
  if (entries.length === NO_ENTRIES)
    return
  console.log(`  ${label}: ${entries.length}`)
  entries.slice(FIRST, LIMIT).forEach(entry =>
    console.log(`    ${describeLine(entry)}`))
}

const emptiness = data =>
  data.oxlint > 0 && data.eslint > 0 ? 'yes' : 'NO'

export const printScenario = (name, data, result) => console.log(
  `${name}: baseline ${data.baseline} oxlint ${data.oxlint} ` +
  `eslint ${data.eslint} missing ${result.missing} ` +
  `extra ${result.extra} ` +
  `line-mismatch ${result.lineMismatches.length} ` +
  `both-nonempty ${emptiness(data)}`,
)

export const printFailures = result => {
  printEntries('missing', result.missingEntries)
  printEntries('extra', result.extraEntries)
  printLines('line-mismatch', result.lineMismatches)
  printLines('line-mismatch allowlisted', result.allowedMismatches)
}

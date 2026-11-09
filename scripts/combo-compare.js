import {realpathSync} from 'node:fs'
import {resolve} from 'node:path'

const SEPARATOR = '\u0000'
const LINE_SEPARATOR = ','

const absolute = (cwd, file) => realpathSync(resolve(cwd, file))

export const normalize = (cwd, diagnostics) =>
  diagnostics.map(diagnostic => ({
    ...diagnostic,
    file: absolute(cwd, diagnostic.file),
  }))

const keyOf = ({file, ruleId, severity}) =>
  [file, ruleId, severity].join(SEPARATOR)

const linesOf = entry => [...entry.lines].sort((left, right) => left - right)

const add = (grouped, diagnostic) => {
  const key = keyOf(diagnostic)
  const entry = grouped.get(key) ?? {...diagnostic, lines: []}
  entry.lines.push(diagnostic.line)
  grouped.set(key, entry)
  return grouped
}

const group = diagnostics => diagnostics.reduce(add, new Map())

const countOf = (grouped, key) => grouped.get(key)?.lines.length ?? 0

const keysOf = (left, right) => [...new Set([...left.keys(), ...right.keys()])]

const joinedLines = entry => linesOf(entry).join(LINE_SEPARATOR)

const differenceOf = (left, right, key) => ({
  ...left.get(key),
  count: countOf(left, key) - countOf(right, key),
})

const missingEntriesOf = (base, other, keys) =>
  keys
    .filter(key => countOf(base, key) > countOf(other, key))
    .map(key => differenceOf(base, other, key))

const mismatchOf = ({base, other, allowlist}, key) => {
  const left = base.get(key)
  const right = other.get(key)
  if (!left || !right || countOf(base, key) !== countOf(other, key))
    return null
  if (joinedLines(left) === joinedLines(right))
    return null
  return {
    ...left,
    baselineLines: linesOf(left),
    comboLines: linesOf(right),
    allowed: allowlist[left.ruleId],
  }
}

const mismatchesOf = (context, keys) =>
  keys
    .map(key => mismatchOf(context, key))
    .filter(entry => entry !== null)

const totalOf = entries => entries.reduce(
  (total, entry) => total + entry.count,
  0,
)

const allowedOf = entries => entries.filter(entry => entry.allowed)

export const compare = (baseline, combo, allowlist = {}) => {
  const base = group(baseline)
  const other = group(combo)
  const keys = keysOf(base, other)
  const missingEntries = missingEntriesOf(base, other, keys)
  const extraEntries = missingEntriesOf(other, base, keys)
  const mismatches = mismatchesOf({base, other, allowlist}, keys)
  return {
    missing: totalOf(missingEntries),
    extra: totalOf(extraEntries),
    lineMismatches: mismatches.filter(entry => !entry.allowed),
    allowedMismatches: allowedOf(mismatches),
    missingEntries,
    extraEntries,
  }
}

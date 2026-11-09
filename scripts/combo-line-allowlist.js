import {readFileSync} from 'node:fs'

const lastLineOf = file => {
  const text = readFileSync(file, 'utf8')
  if (text === '')
    return 0
  const lines = text.split('\n')
  return text.endsWith('\n') ? lines.length - 1 : lines.length
}

const singleLine = lines => lines.length === 1 ? lines[0] : null

const isLastLineMismatch = ({file, baselineLines, comboLines}) => {
  const baseline = singleLine(baselineLines)
  const combo = singleLine(comboLines)
  if (baseline === null || combo === null)
    return false
  return baseline < combo && combo === lastLineOf(file)
}

export const LINE_ALLOWLIST = {
  'max-lines': isLastLineMismatch,
}

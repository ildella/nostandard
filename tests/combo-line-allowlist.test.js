import {
  mkdtemp,
  rm,
  writeFile,
} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {LINE_ALLOWLIST} from '../scripts/combo-line-allowlist.js'

const maxLines = LINE_ALLOWLIST['max-lines']

const withFile = async (content, assertion) => {
  const dir = await mkdtemp(join(tmpdir(), 'nostandard-allowlist-'))
  const file = join(dir, 'file.js')
  await writeFile(file, content)
  try {
    return assertion(file)
  } finally {
    await rm(dir, {recursive: true, force: true})
  }
}

const entry = (file, baselineLines, comboLines) => ({
  file,
  ruleId: 'max-lines',
  baselineLines,
  comboLines,
})

test('allows the known first-line/last-line max-lines mismatch', async () => {
  await withFile('a\nb\nc\nd\ne\n', file => {
    expect(maxLines(entry(file, [4], [5]))).toBe(true)
  })
})

test('rejects a max-lines mismatch away from the last line', async () => {
  await withFile('a\nb\nc\nd\ne\n', file => {
    expect(maxLines(entry(file, [4], [4]))).toBe(false)
  })
})

test('rejects a max-lines mismatch reported on an earlier line', async () => {
  await withFile('a\nb\nc\nd\ne\n', file => {
    expect(maxLines(entry(file, [3], [4]))).toBe(false)
  })
})

test('rejects a max-lines mismatch spanning several lines', async () => {
  await withFile('a\nb\nc\nd\ne\n', file => {
    expect(maxLines(entry(file, [4], [4, 5]))).toBe(false)
  })
})

test('rejects a max-lines mismatch with an empty baseline', async () => {
  await withFile('a\nb\nc\nd\ne\n', file => {
    expect(maxLines(entry(file, [], [5]))).toBe(false)
  })
})

test('counts the last line without a trailing newline', async () => {
  await withFile('a\nb\nc\nd\ne', file => {
    expect(maxLines(entry(file, [4], [5]))).toBe(true)
  })
})

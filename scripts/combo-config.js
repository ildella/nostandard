import {
  mkdir,
  mkdtemp,
  rm,
  symlink,
} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {URL, fileURLToPath} from 'node:url'

export const ROOT = fileURLToPath(new URL('..', import.meta.url))
export const TEMP_ROOT = await mkdtemp(join(tmpdir(), 'nostandard-combo-'))
export const SCENARIO_ROOT = join(TEMP_ROOT, 'scenarios')
export const GENERATED = join(ROOT, 'src/generated')
export const INDEX = join(ROOT, 'src/index.js')
export const SVELTE_CONFIG = join(ROOT, 'src/configs/svelte.js')
export const ESLINT = join(ROOT, 'node_modules/.bin/eslint')
export const OXLINT = join(ROOT, 'node_modules/.bin/oxlint')

export const cleanup = () => rm(TEMP_ROOT, {recursive: true, force: true})

export const prepare = async () => {
  await mkdir(SCENARIO_ROOT, {recursive: true})
  await symlink(join(ROOT, 'node_modules'), join(TEMP_ROOT, 'node_modules'))
}

import {join} from 'node:path'
import {ESLINT, OXLINT, ROOT} from './combo-config.js'
import {run} from './combo-exec.js'
import {parseEslint, parseOxlint} from './combo-parse.js'
import {normalize} from './combo-compare.js'
import {
  baselineConfigPath,
  comboConfigPath,
  oxlintConfigPath,
  writeScenario,
} from './combo-write.js'

const ESLINT_ARGS = ['-f', 'json', '--no-cache', '--config']
const OXLINT_ARGS = ['--format', 'json', '-c']
const TARGET = '.'

const stdoutOf = async (command, args, cwd) => {
  const result = await run(command, args, cwd)
  return result.stdout
}

const eslintOf = async (cwd, config) =>
  normalize(cwd, parseEslint(
    await stdoutOf(ESLINT, [...ESLINT_ARGS, config, TARGET], cwd),
  ))

const oxlintOf = async (cwd, config) =>
  normalize(cwd, parseOxlint(
    await stdoutOf(OXLINT, [...OXLINT_ARGS, config, TARGET], cwd),
  ))

const allOf = async (scenario, cwd) => {
  const [baseline, oxlint, eslint] = await Promise.all([
    eslintOf(cwd, baselineConfigPath(scenario)),
    oxlintOf(cwd, oxlintConfigPath(scenario)),
    eslintOf(cwd, comboConfigPath(scenario)),
  ])
  return {baseline, oxlint, eslint}
}

export const scenarioDiagnostics = async scenario => {
  const dir = await writeScenario(scenario)
  const cwd = scenario.repo ? ROOT : join(dir)
  return allOf(scenario, cwd)
}

import console from 'node:console'
import process from 'node:process'
import {cleanup, prepare, TEMP_ROOT} from './combo-config.js'
import {compare} from './combo-compare.js'
import {LINE_ALLOWLIST} from './combo-line-allowlist.js'
import {printFailures, printScenario} from './combo-report.js'
import {scenarioDiagnostics} from './combo-runner.js'
import {REPO_SCENARIO, SCENARIOS} from './combo-scenarios.js'

const SVELTE_EXTENSIONS = ['.svelte', '.svelte.js']
const NO_DIAGNOSTICS = 0

const isSvelteFile = file =>
  SVELTE_EXTENSIONS.some(extension => file.endsWith(extension))

const isBadVar = diagnostic =>
  diagnostic.ruleId === 'no-var' && diagnostic.file.endsWith('/bad.js')

const countOn = (diagnostics, predicate) =>
  diagnostics.filter(predicate).length

const reportSvelte = ({oxlint, eslint}) => {
  const svelteEslint = countOn(eslint, entry => isSvelteFile(entry.file))
  const svelteOxlint = countOn(oxlint, entry => isSvelteFile(entry.file))
  const badVar = countOn(oxlint, isBadVar)
  console.log(
    `  svelte: eslint ${svelteEslint} oxlint-on-svelte ${svelteOxlint} ` +
    `bad.js no-var ${badVar}`,
  )
  const ok = svelteEslint > NO_DIAGNOSTICS &&
    svelteOxlint === NO_DIAGNOSTICS &&
    badVar > NO_DIAGNOSTICS
  return ok ? 0 : 1
}

const parityFails = result =>
  result.missing > 0 || result.extra > 0 ||
  result.lineMismatches.length > 0

const emptinessFails = (scenario, counts) =>
  !scenario.repo && (counts.oxlint < 1 || counts.eslint < 1)

const reportEmpty = (scenario, counts) => {
  if (emptinessFails(scenario, counts))
    console.log(
      `  ${scenario.name}: oxlint ${counts.oxlint} ` +
      `eslint ${counts.eslint} diagnostic(s), both sides must be non-empty`,
    )
}

const runScenario = async scenario => {
  const data = await scenarioDiagnostics(scenario)
  const counts = {
    baseline: data.baseline.length,
    oxlint: data.oxlint.length,
    eslint: data.eslint.length,
  }
  const result = compare(
    data.baseline,
    [...data.oxlint, ...data.eslint],
    LINE_ALLOWLIST,
  )
  printScenario(scenario.name, counts, result)
  printFailures(result)
  reportEmpty(scenario, counts)
  const svelte = scenario.svelte ? reportSvelte(data) : 0
  const failed = parityFails(result) ||
    emptinessFails(scenario, counts) || svelte > 0
  return failed ? 1 : 0
}

const runAll = scenarios => scenarios.reduce(
  async (previous, scenario) =>
    [...await previous, await runScenario(scenario)],
  Promise.resolve([]),
)

const main = async () => {
  await prepare()
  const codes = await runAll([...SCENARIOS, REPO_SCENARIO])
  return codes.some(code => code !== 0) ? 1 : 0
}

const finish = async code => {
  if (code !== 0) {
    console.log(`temp dir kept at ${TEMP_ROOT}`)
    return code
  }
  await cleanup()
  return 0
}

process.exitCode = await finish(await main())

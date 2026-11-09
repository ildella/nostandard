import {mkdir, writeFile} from 'node:fs/promises'
import {dirname, join} from 'node:path'
import {
  GENERATED,
  INDEX,
  ROOT,
  SCENARIO_ROOT,
  SVELTE_CONFIG,
} from './combo-config.js'
import {SLICE_FILE} from '../src/oxlint/slices.js'
import {SVELTE_IGNORES} from '../src/oxlint/file-scope.js'

const CONFIG_DIR = '_config'
const CONFIG_IGNORES = [`${CONFIG_DIR}/**`]
const RECOMMENDED = 'recommended'

const quote = value => JSON.stringify(value)

const lines = (...items) => `${items.join('\n')}\n`

const hasSlice = scenario =>
  !scenario.svelte && scenario.slice !== RECOMMENDED

export const stemOf = scenario => SLICE_FILE[scenario.slice]

const scenarioDir = scenario => join(SCENARIO_ROOT, scenario.name)

const configDir = scenario => join(scenarioDir(scenario), CONFIG_DIR)

const generatedPath = (stem, suffix) =>
  join(GENERATED, `${stem}.${suffix}.json`)

const sliceConfigPath = scenario =>
  join(ROOT, 'src/configs', `${stemOf(scenario)}.js`)

const baseImports = scenario => {
  if (scenario.svelte)
    return [
      `import {nostandard} from ${quote(INDEX)}`,
      `import svelte from ${quote(SVELTE_CONFIG)}`,
    ]
  const slice = hasSlice(scenario)
    ? [`import slice from ${quote(sliceConfigPath(scenario))}`]
    : []
  return [`import {nostandard} from ${quote(INDEX)}`, ...slice]
}

const baseEntries = scenario => {
  if (scenario.svelte)
    return ['  ...nostandard.recommended,', '  ...svelte,']
  const slice = hasSlice(scenario) ? ['  slice,'] : []
  return ['  ...nostandard.recommended,', ...slice]
}

const baselineSource = scenario => lines(
  ...baseImports(scenario),
  '',
  'export default [',
  ...baseEntries(scenario),
  `  {ignores: ${quote(CONFIG_IGNORES)}},`,
  ']',
)

const offImports = scenario => {
  const recommendedOff = [
    `import off from ${quote(generatedPath(RECOMMENDED, 'eslint-off'))} ` +
    'with {type: \'json\'}',
  ]
  if (!hasSlice(scenario))
    return recommendedOff
  const sliceOff = [
    'import sliceOff from ' +
    `${quote(generatedPath(stemOf(scenario), 'eslint-off'))} ` +
    'with {type: \'json\'}',
  ]
  return [...recommendedOff, ...sliceOff]
}

const offEntries = scenario =>
  hasSlice(scenario) ? ['  ...off,', '  ...sliceOff,'] : ['  ...off,']

const comboSource = scenario => lines(
  'import base from \'./eslint.base.js\'',
  ...offImports(scenario),
  '',
  'export default [',
  '  ...base,',
  ...offEntries(scenario),
  ']',
)

const oxlintExtends = scenario => {
  const recommended = generatedPath(RECOMMENDED, 'oxlint')
  if (!hasSlice(scenario))
    return [recommended]
  return [recommended, generatedPath(stemOf(scenario), 'oxlint')]
}

const oxlintSource = scenario => JSON.stringify({
  extends: oxlintExtends(scenario),
  ignorePatterns: [...SVELTE_IGNORES, ...CONFIG_IGNORES],
}, null, 2)

const writeFiles = async (dir, files) => {
  const entries = Object.entries(files)
  await Promise.all(entries.map(async ([path, content]) => {
    const target = join(dir, path)
    await mkdir(dirname(target), {recursive: true})
    await writeFile(target, content)
  }))
}

export const baselineConfigPath = scenario =>
  join(configDir(scenario), 'eslint.base.js')

export const comboConfigPath = scenario =>
  join(configDir(scenario), 'eslint.combo.js')

export const oxlintConfigPath = scenario =>
  join(scenarioDir(scenario), 'oxlint.json')

export const writeScenario = async scenario => {
  const dir = scenarioDir(scenario)
  const config = configDir(scenario)
  await mkdir(config, {recursive: true})
  await writeFiles(dir, scenario.files ?? {})
  await writeFile(baselineConfigPath(scenario), baselineSource(scenario))
  await writeFile(comboConfigPath(scenario), comboSource(scenario))
  await writeFile(oxlintConfigPath(scenario), oxlintSource(scenario))
  return dir
}

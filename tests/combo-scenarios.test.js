import {SLICES} from '../src/oxlint/slices.js'
import {SCENARIOS} from '../scripts/combo-scenarios.js'

const SVELTE = 'svelte'
const KEYS = [...Object.keys(SLICES), SVELTE]

const countOf = key =>
  SCENARIOS.filter(scenario => scenario.slice === key).length

const sliceKeys = () => SCENARIOS.map(scenario => scenario.slice).toSorted()

test.each(KEYS)('%s has exactly one scenario', key => {
  expect(countOf(key)).toBe(1)
})

test('scenarios cover only the known slices', () => {
  expect(sliceKeys()).toStrictEqual(KEYS.toSorted())
})

// Lints probe files with every exported config, each on top of recommended
// as consumers use it: ESLint validates a config (plugins, rule names,
// options) only when it lints a file with it.
import console from 'node:console'
import process from 'node:process'
import {URL} from 'node:url'
import {ESLint} from 'eslint'
import pkg from '../package.json' with {type: 'json'}
import {nostandard} from '../src/index.js'

const probes = [
  'src/x.js',
  'src/x.svelte',
  'src/x.svelte.js',
  'tests/x.test.js',
  'e2e/x.spec.js',
]
const skipped = new Set(['./package.json', './plugin'])
const entries = Object.entries(pkg.exports)
  .filter(([subpath]) => !skipped.has(subpath))

const lintProbe = eslint => filePath => eslint
  .lintText('export const a = 1\n', {filePath})
  .then(() => '', error => `${filePath}: ${error.message.split('\n')[0]}`)

const check = async ([subpath, file]) => {
  // configs come from package.json exports, so the import is dynamic
  // eslint-disable-next-line nostandard/no-dynamic-import
  const {default: config} = await import(new URL(`../${file}`, import.meta.url))
  const overrideConfig = [...nostandard.recommended, config].flat()
  const eslint = new ESLint({overrideConfigFile: true, overrideConfig})
  const errors = await Promise.all(probes.map(lintProbe(eslint)))
  const error = errors.find(Boolean)
  console.log(error ? `FAIL ${subpath} ${error}` : `ok   ${subpath}`)
  return !error
}

const results = await Promise.all(entries.map(check))
process.exitCode = results.every(Boolean) ? 0 : 1

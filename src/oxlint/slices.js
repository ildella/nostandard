import {nostandard} from '../index.js'
import functional from '../configs/functional.js'
import unicorn from '../configs/unicorn.js'
import vitest from '../configs/vitest.js'
import importX from '../configs/import-x.js'
import sonarjs from '../configs/sonarjs.js'
import playwright from '../configs/playwright.js'

export const SLICES = {
  recommended: nostandard.recommended,
  functional: [functional],
  unicorn: [unicorn],
  vitest: [vitest],
  importX: [importX],
  sonarjs: [sonarjs],
  playwright: [playwright],
}

export const SLICE_FILE = {
  recommended: 'recommended',
  functional: 'functional',
  unicorn: 'unicorn',
  vitest: 'vitest',
  importX: 'import-x',
  sonarjs: 'sonarjs',
  playwright: 'playwright',
}

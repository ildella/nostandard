# NoStandard

An opinionated ESLint flat-config bundle: essential correctness rules plus a strong style layer via [Stylistic](https://eslint.style/), with opt-in configs for Svelte, Vitest, import-x, SonarJS, functional, unicorn and Playwright.

A consolidation of my old [eslint configurations](https://github.com/ildella/eslint-config-node-moar), rebuilt as a single package on flat config.

## Requirements

- Node.js >= 20
- ESLint 10 (recommended). ESLint 9 is still supported — it is end-of-life, but flat config is identical, so everything works the same.

## What's in here?

- **base** — core ESLint rules for correctness and best practices, plus the
  custom `nostandard/max-destructured-properties`,
  `nostandard/no-dynamic-import` and `nostandard/restricted-syntax` rules (see
  [docs/custom-rules.md](docs/custom-rules.md))
- **style** — opinionated formatting via [Stylistic](https://eslint.style/)
- **svelte** — Svelte rules via `eslint-plugin-svelte` (optional, subpath import)
- **vitest** — Vitest rules via `@vitest/eslint-plugin` (optional, subpath import)
- **import-x** — curated import-x rules for `src/` and `tests/` (optional, subpath import)
- **sonarjs** — SonarJS recommended rules with curated overrides (optional, subpath import)
- **functional** — functional recommended rules with curated overrides (optional, subpath import)
- **unicorn** — unicorn recommended rules with curated overrides (optional, subpath import)
- **playwright** — Playwright recommended rules for `e2e/` files (optional, subpath import)

### Packages at a glance

Every config needs the plugin(s) it wraps installed in your project. This table is the single source of truth:

| Config | Import | You also install | Export shape |
| --- | --- | --- | --- |
| base | `nostandard.base` | `eslint`, `@eslint/js`, `globals` | object |
| style | `nostandard.style` | `@stylistic/eslint-plugin` | object |
| svelte | `eslint-nostandard/svelte` | `eslint-plugin-svelte`, `svelte` | array |
| vitest | `eslint-nostandard/vitest` | `@vitest/eslint-plugin` | object |
| import-x | `eslint-nostandard/import-x` | `eslint-plugin-import-x` | object |
| sonarjs | `eslint-nostandard/sonarjs` | `eslint-plugin-sonarjs` | object |
| functional | `eslint-nostandard/functional` | `eslint-plugin-functional` | object |
| unicorn | `eslint-nostandard/unicorn` | `eslint-plugin-unicorn` | object |
| playwright | `eslint-nostandard/playwright` | `eslint-plugin-playwright` | object |

The export shape tells you how to add the config to your array: objects go in as-is, arrays are spread (see examples below).

## Usage

NoStandard has zero dependencies: everything it uses is a peer dependency of this package, most of them optional. Install what you actually lint with.

Install the package together with the required peers for base + style:

```shell
yarn add -D eslint-nostandard eslint @eslint/js globals @stylistic/eslint-plugin
```

```shell
pnpm add -D eslint-nostandard eslint @eslint/js globals @stylistic/eslint-plugin
```

```shell
npm install -D eslint-nostandard eslint @eslint/js globals @stylistic/eslint-plugin
```

> npm (7+) and recent pnpm auto-install missing required peer dependencies; yarn does not. The explicit command above works everywhere, every time.

Basic usage for `eslint.config.js`:

```js
import {nostandard} from 'eslint-nostandard'

export default [
  ...nostandard.recommended,  // base + style

  // Or pick individually:
  // nostandard.base,
  // nostandard.style,
]
```

By default `base` enables ES2024 globals. To add `node`, browser or test globals, see [docs/globals.md](docs/globals.md).

### Svelte

Install the optional peer dependencies, then import from the subpath:

```shell
yarn add -D eslint-plugin-svelte svelte
```

```js
import {nostandard} from 'eslint-nostandard'
import svelte from 'eslint-nostandard/svelte'

export default [
  ...nostandard.recommended,
  ...svelte,
]
```

### Vitest

Install the optional peer dependency, then import from the subpath:

```shell
yarn add -D @vitest/eslint-plugin
```

```js
import {nostandard} from 'eslint-nostandard'
import vitest from 'eslint-nostandard/vitest'

export default [
  ...nostandard.recommended,
  vitest,
]
```

### import-x

Install the optional peer dependency, then import from the subpath:

```shell
yarn add -D eslint-plugin-import-x
```

```js
import {nostandard} from 'eslint-nostandard'
import importX from 'eslint-nostandard/import-x'

export default [
  ...nostandard.recommended,
  importX,
]
```

### sonarjs

Install the optional peer dependency, then import from the subpath:

```shell
yarn add -D eslint-plugin-sonarjs
```

```js
import {nostandard} from 'eslint-nostandard'
import sonarjs from 'eslint-nostandard/sonarjs'

export default [
  ...nostandard.recommended,
  sonarjs,
]
```

### functional

Install the optional peer dependency, then import from the subpath:

```shell
yarn add -D eslint-plugin-functional
```

```js
import {nostandard} from 'eslint-nostandard'
import functional from 'eslint-nostandard/functional'

export default [
  ...nostandard.recommended,
  functional,
]
```

### unicorn

Install the optional peer dependency, then import from the subpath:

```shell
yarn add -D eslint-plugin-unicorn
```

```js
import {nostandard} from 'eslint-nostandard'
import unicorn from 'eslint-nostandard/unicorn'

export default [
  ...nostandard.recommended,
  unicorn,
]
```

### playwright

Install the optional peer dependency, then import from the subpath:

```shell
yarn add -D eslint-plugin-playwright
```

```js
import {nostandard} from 'eslint-nostandard'
import playwright from 'eslint-nostandard/playwright'

export default [
  ...nostandard.recommended,
  playwright,
]
```

## Customizing

Configs are plain flat-config objects: later entries override earlier ones.

```js
import {nostandard} from 'eslint-nostandard'

export default [
  ...nostandard.recommended,
  {
    rules: {
      'max-lines': 'off',
      'complexity': ['warn', 10],
    },
  },
]
```

On recent ESLint versions you can also use `defineConfig` with `extends` — the package default export is exactly `nostandard.recommended`:

```js
import {defineConfig} from 'eslint/config'
import nostandard from 'eslint-nostandard'

export default defineConfig([
  {
    files: ['**/*.js'],
    extends: [nostandard],
  },
])
```

## Golden Rule

If it breaks, it's an error.
If it does not break, it's a warning.

With one and only one special exception, as all good rules must have an exception: **semicolons are an error** (`@stylistic/semi: ['error', 'never']`). It breaks nothing, yet it defines us. This is NoStandard, after all.

## Why not NeoStandard then?

There are too many useless dependencies. Especially I do not consider usable anything that gives for granted that developers use React, or any other specific framework. Why would I want anything JSX or React in my NodeJS or Svelte projects?

For the same reason, I do not want `eslint-plugin-n` as a default dependency.

Finally, they do not respect my Golden Rule.

## Design notes

- **Everything is a peer dependency, most of it optional.** The official guidance for shareable configs is to bundle wrapped plugins as hard `dependencies`; here every plugin is declared as an *optional* peer instead. Your project declares what it lints with and nothing lands in your `node_modules` unless you asked for it. Consequence: you install the packages yourself, as shown above.
- **What is this thing, a plugin or a config?** Per the ESLint docs taxonomy it is mostly a *shareable config*: the exports are configuration objects, built on other plugins. The exception is the small `nostandard` plugin, shipped with the package, that hosts our own rules (currently `max-destructured-properties`, `no-dynamic-import` and `restricted-syntax`, see [docs/custom-rules.md](docs/custom-rules.md)). The name predates strict adherence to the `eslint-config-*` convention and stays — now you know.

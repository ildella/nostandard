# NoStandard

A consolidation of my old [eslint configurations](https://github.com/ildella/eslint-config-node-moar) ported to ESLint 9+ and Flat configuration.

## What's in here?

- **base** — core ESLint rules for correctness and best practices
- **style** — opinionated formatting via [Stylistic](https://eslint.style/)
- **svelte** — Svelte rules via `eslint-plugin-svelte` (optional, subpath import)
- **vitest** — Vitest rules via `@vitest/eslint-plugin` (optional, subpath import)
- **import-x** — curated import-x rules for `src/` and `tests/` (optional, subpath import)
- **sonarjs** — SonarJS recommended rules with curated overrides (optional, subpath import)
- **functional-unicorn** — functional + unicorn recommended rules with curated overrides (optional, subpath import)
- **playwright** — Playwright recommended rules for `e2e/` files (optional, subpath import)

## Usage

```shell
yarn add -D eslint-nostandard
pnpm add -D eslint-nostandard
npm install -D eslint-nostandard
```

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

### Svelte

Install the optional peer dependency, then import from the subpath:

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

### functional-unicorn

Install the optional peer dependencies, then import from the subpath:

```shell
yarn add -D eslint-plugin-functional eslint-plugin-unicorn
```

```js
import {nostandard} from 'eslint-nostandard'
import functionalUnicorn from 'eslint-nostandard/functional-unicorn'

export default [
  ...nostandard.recommended,
  ...functionalUnicorn,
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

## Why not NeoStandard then?

There are too many useless dependencies. Especially I do not consider usable anything that gives for granted that developers use React, or any other specific framework. Why would I want anything JSX or React in my NodeJS or Svelte projects?

For the same reason, I do not want `eslint-plugin-n` as a default dependency.

Finally, they do not respect my golden rule.

## Golden Rule

If it breaks, it's an error.
If it does not break, it's a warning.

With one and only one special exception, as all good rules must have an exception.

# NoStandard

A consolidation of my old [eslint configurations](https://github.com/ildella/eslint-config-node-moar) ported to ESLint 9+ and Flat configuration.

## What's in here?

- **base** — core ESLint rules for correctness and best practices
- **style** — opinionated formatting via [Stylistic](https://eslint.style/)
- **svelte** — Svelte rules via `eslint-plugin-svelte` (optional, subpath import)
- **vitest** — Vitest rules via `@vitest/eslint-plugin` (optional, subpath import)

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

## Why not NeoStandard then?

There are too many useless dependencies. Especially I do not consider usable anything that gives for granted that developers use React, or any other specific framework. Why would I want anything JSX or React in my NodeJS or Svelte projects?

For the same reason, I do not want `eslint-plugin-n` as a default dependency.

Finally, they do not respect my golden rule.

## Golden Rule

If it breaks, it's an error.
If it does not break, it's a warning.

With one and only one special exception, as all good rules must have an exception.

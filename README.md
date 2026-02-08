# NoStandard

A consolidation of my old [eslint configurations](https://github.com/ildella/eslint-config-node-moar) ported to ESLint 9+ and Flat configuration.

The overall project structure has been taken from [NeoStandard](https://github.com/neostandard/neostandard) from which I also borrowed some additional `base` and `style` rules that despite were not in my original ruleset, were not causing any issue with my current projects. They have all been converted to the Golden Rule.

## Install

```shell
yarn add -D eslint-nostandard eslint @eslint/js @stylistic/eslint-plugin-js globals
```

For Svelte projects, also install:
```shell
yarn add -D eslint-plugin-svelte
```

For Vitest projects, also install:
```shell
yarn add -D @vitest/eslint-plugin
```

## Usage

```js
const nostandard = require('eslint-nostandard')

module.exports = [
  // Use recommended preset (base + style rules)
  ...nostandard.configs.recommended,

  // Or compose manually:
  // nostandard.configs.base,
  // nostandard.configs.style,

  // Add Svelte support (requires eslint-plugin-svelte)
  // ...nostandard.configs.svelte,

  // Add Vitest support (requires @vitest/eslint-plugin)
  // nostandard.configs.vitest,
]
```

## Configs

### `recommended` (array)

Combines `base` and `style`. Spread it: `...nostandard.configs.recommended`

### `base` (object)

Core ESLint rules: recommended rules + opinionated base rules.

### `style` (object)

Stylistic rules via `@stylistic/eslint-plugin-js`.

### `svelte` (array)

Self-contained Svelte config. Includes `eslint-plugin-svelte` flat/recommended plus custom formatting and best-practice rules. Spread it: `...nostandard.configs.svelte`

Requires `eslint-plugin-svelte` to be installed. Lazy-loaded — if you never access it, the plugin is never required.

### `vitest` (object)

Self-contained Vitest config. Registers the `@vitest/eslint-plugin` with recommended rules plus custom overrides. Single object: `nostandard.configs.vitest`

Requires `@vitest/eslint-plugin` to be installed. Lazy-loaded — if you never access it, the plugin is never required.

## Why not NeoStandard then?

There are too many useless dependencies. Especially I do not consider usable anything that gives for granted that developers use React, or any other specific framework. Why would I want anytning JSX or React in my NodeJS or Svelte projects?

For the same reason, I do not want `eslint-plugin-n` as a default dependency.

Finally, they do not respect my golden rule.

## Golden Rule

If it breaks, it's an error.
If it does not break, it's a warning.

With one and only one special exception, as all good rules must have an exception.

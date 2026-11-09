# Oxlint

Oxlint runs the rules it can run; ESLint keeps the rest, including Svelte. You
run both, and each rule is enforced by exactly one of them. A project that
ignores this page keeps exactly today's ESLint behaviour — nothing here changes
unless you opt in.

## Versions

Oxlint must be at least `1.92.0`; the peer range accepts any newer version, so
pick and pin the exact version you want. The parity run behind this release used
Oxlint `1.93.0` and `@oxlint/migrate` `1.92.0`. You do not need
`@oxlint/migrate`: it is an optional peer of this package, used only by its
maintainers to regenerate `src/generated`. Consumers never install or run it.

## Install

```shell
yarn add -D eslint-nostandard oxlint
```

```shell
pnpm add -D eslint-nostandard oxlint
```

```shell
npm install -D eslint-nostandard oxlint
```

## Configure Oxlint

Use `oxlint.config.ts`:

```ts
import {defineConfig} from 'oxlint'
import recommended from 'eslint-nostandard/oxlint' with {type: 'json'}

const SVELTE = ['**/*.svelte', '**/*.svelte.js', '**/*.svelte.ts']

export default defineConfig({
  ignorePatterns: SVELTE,
  extends: [recommended],
})
```

**The root `ignorePatterns` is REQUIRED.** `extends` drops the
`ignorePatterns` published in the slice, so the consumer's root config has to
declare them. Without them, Oxlint lints `.svelte` script blocks with the
non-Svelte rule options and reports false positives, while ESLint is the one
that should check those files.

Not `.oxlintrc.json`: package imports do not work in the JSON config, so the
generated slice cannot be imported there.

## Configure ESLint

Keep your existing array exactly as it is, then append the matching off-set
**last**:

```js
import {nostandard} from 'eslint-nostandard'
import recommendedOff from 'eslint-nostandard/oxlint/eslint-off' with {type: 'json'}

export default [
  ...nostandard.recommended,
  // ...your existing config and local overrides
  ...recommendedOff,
]
```

The off-set turns off, in ESLint, every rule that Oxlint now owns. It is an
array of config objects scoped exactly like the slice it comes from: the global
rules apply to `.js`, `.jsx`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.mts` and `.cts`
files, while a file-scoped slice only turns rules off on its own globs. No entry
ever applies to `**/*.svelte`, `**/*.svelte.js` or `**/*.svelte.ts`: Svelte
keeps its rules on ESLint. Read the file if you need to know exactly which
rules moved.

## Lint script

```json
{
  "scripts": {
    "lint": "oxlint && eslint"
  }
}
```

ESLint must keep seeing `.js` files. Several rules stay on ESLint (`camelcase`,
`import-x/order`, and most of `unicorn/*`), so scoping ESLint to Svelte files
only would silently drop them.

## Optional slices

Each config has a pair: the Oxlint slice and its ESLint off-set.

| ESLint config | Oxlint slice | ESLint off-set |
| --- | --- | --- |
| `eslint-nostandard/functional` | `eslint-nostandard/oxlint/functional` | `eslint-nostandard/oxlint/eslint-off/functional` |
| `eslint-nostandard/unicorn` | `eslint-nostandard/oxlint/unicorn` | `eslint-nostandard/oxlint/eslint-off/unicorn` |
| `eslint-nostandard/vitest` | `eslint-nostandard/oxlint/vitest` | `eslint-nostandard/oxlint/eslint-off/vitest` |
| `eslint-nostandard/import-x` | `eslint-nostandard/oxlint/import-x` | `eslint-nostandard/oxlint/eslint-off/import-x` |
| `eslint-nostandard/sonarjs` | `eslint-nostandard/oxlint/sonarjs` | `eslint-nostandard/oxlint/eslint-off/sonarjs` |
| `eslint-nostandard/playwright` | `eslint-nostandard/oxlint/playwright` | `eslint-nostandard/oxlint/eslint-off/playwright` |

Extend the Oxlint slices in the same order as your ESLint imports, because
`functional` redefines `no-param-reassign`:

```ts
import {defineConfig} from 'oxlint'
import recommended from 'eslint-nostandard/oxlint' with {type: 'json'}
import functional from 'eslint-nostandard/oxlint/functional' with {type: 'json'}
import unicorn from 'eslint-nostandard/oxlint/unicorn' with {type: 'json'}

const SVELTE = ['**/*.svelte', '**/*.svelte.js', '**/*.svelte.ts']

export default defineConfig({
  ignorePatterns: SVELTE,
  extends: [recommended, functional, unicorn],
})
```

And the same order in ESLint:

Each off-set is an array of config objects, so spread it with `...`:

```js
import {nostandard} from 'eslint-nostandard'
import functional from 'eslint-nostandard/functional'
import unicorn from 'eslint-nostandard/unicorn'
import recommendedOff from 'eslint-nostandard/oxlint/eslint-off' with {type: 'json'}
import functionalOff from 'eslint-nostandard/oxlint/eslint-off/functional' with {type: 'json'}
import unicornOff from 'eslint-nostandard/oxlint/eslint-off/unicorn' with {type: 'json'}

export default [
  ...nostandard.recommended,
  functional,
  unicorn,
  ...recommendedOff,
  ...functionalOff,
  ...unicornOff,
]
```

## Svelte

Only `eslint-nostandard/svelte`. There is no Oxlint twin. Template and script in
`**/*.svelte`, `**/*.svelte.js` and `**/*.svelte.ts` stay entirely on ESLint:
the off-set never applies to those files, so Svelte keeps every rule that ESLint
would otherwise turn off. Keep importing `eslint-nostandard/svelte` into
`eslint.config.js`, and add the three Svelte globs to the root `ignorePatterns`
of `oxlint.config.ts` so Oxlint skips them.

## Local overrides

This is the one manual step. Any rule you changed locally must be repeated in
`oxlint.config.ts` after `extends`, with the same severity and options:

```ts
import {defineConfig} from 'oxlint'
import recommended from 'eslint-nostandard/oxlint' with {type: 'json'}

export default defineConfig({
  extends: [recommended],
  rules: {
    'max-lines': 'off',
    complexity: ['warn', 10],
  },
})
```

Never place an override after the off-set in ESLint: that re-enables the rule
and it runs twice. An override that exists only in ESLint is lost once the
off-set is appended, because the off-set comes last.

## `.gitignore`

Oxlint respects `.gitignore`. ESLint does not. Files ignored by git are not
linted by Oxlint, so a file you excluded from git is now excluded from half
your lint setup.

## Rollback

Remove the Oxlint `extends`, remove the off-set imports and entries, and drop
the `oxlint &&` prefix from the lint script. What remains is your previous
ESLint setup, unchanged.

## How this is generated

For maintainers of this package.

The flat config is the source of truth. `yarn generate:oxlint` rewrites
`src/generated/*` by migrating each slice with `@oxlint/migrate` and post
processing the result. The partition invariant is checked at generation time:
every rule enabled in a slice ends up in exactly one of the Oxlint config or
the ESLint off-set, never both and never neither.

The deny-list holds rules Oxlint accepts but does not implement correctly.
Today it is `vitest/no-conditional-expect` and `vitest/valid-expect`: both stay
on ESLint on purpose, so they are denied from the Oxlint side even though the
migrator would happily emit them.

Run `yarn lint:combo` to prove parity between the two setups.

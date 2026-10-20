# Globals

The `base` config enables the ES2024 built-ins only (`globals.es2024`). It deliberately does not assume where your code runs: no `node`, no `browser`, no test runner globals.

To add more, extend `languageOptions.globals` in a later entry of your `eslint.config.js`. Presets come from the [`globals`](https://www.npmjs.com/package/globals) package (a required peer dependency of NoStandard):

```js
import {nostandard} from 'eslint-nostandard'
import globals from 'globals'

export default [
  ...nostandard.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
```

Combine as needed — for example browser code with Node build scripts:

```js
{
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
}
```

## Available presets

Some of the most common presets (see the `globals` package documentation for the full and current list):

- **Environments:** `browser`, `node`, `shared-node-browser`, `worker`, `serviceworker`, `webextensions`
- **Built-ins by language version:** `es3`, `es5`, `es2015` through `es2025`, `builtin`, `nodeBuiltin`
- **Test runners:** `vitest` is covered by the optional [vitest config](../README.md#vitest); also available: `jest`, `mocha`, `jasmine`, `chai`, `qunit`
- **Legacy / other:** `amd`, `commonjs`, `jquery`, `mongo`, `shelljs`, `phantomjs`, and more

Note: preset names are case-sensitive (`es2015`, not `es2015+`; `nodeBuiltin`, not `nodebuiltin`).

## Custom rules

The custom rules shipped by NoStandard, `nostandard/max-destructured-properties` and `nostandard/no-dynamic-import`, are part of the `base` config and are unrelated to globals. The first counts the properties destructured in a function parameter and warns above `max` (default `3`); the second bans dynamic `import()`. See [custom-rules.md](custom-rules.md).

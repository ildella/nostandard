# Oxlint migration spike

Throwaway spike run on branch `feat/oxlint-2`. Nothing here is shipped code.

## Versions

- oxlint `1.92.0` (`npx oxlint --version` prints `Version: 1.92.0`)
- @oxlint/migrate `1.92.0`

## Inputs

- `/tmp/opencode/nostandard-spike/recommended.config.js`: `export default nostandard.recommended`
- `/tmp/opencode/nostandard-spike/full.config.js`: `nostandard.recommended`, then functional,
  unicorn, vitest, import-x, sonarjs, playwright, and `...svelte`
- Commands: `@oxlint/migrate <config> --js-plugins --details --output-file <file>`
- The CLI joins the config path onto `cwd`, so an absolute path resolves to
  `<cwd>/tmp/...`. Run it with the temp dir as `cwd`, or pass a relative path.

## Generated output, recommended config (204 rules)

Top level keys: `$schema`, `plugins`, `jsPlugins`, `categories`, `env`, `rules`.

- `plugins`: `[]`
- `jsPlugins`: `["@stylistic/eslint-plugin"]`
- `categories`: `{"correctness":"off"}`
- `env`: `{"builtin":true,"es2024":true}`
- No `overrides`.

The custom `nostandard` plugin does NOT appear in `jsPlugins`. Its rule ids are
still written into `rules` when they come from a config that registers the plugin
(for example `functional`), so the emitted config references rules whose plugin
is not declared.

## Generated output, full config (670 rules)

Top level keys: those above plus `overrides`.

- `plugins`: `["unicorn"]`
- `jsPlugins`: `["@stylistic/eslint-plugin","eslint-plugin-functional","eslint-plugin-sonarjs","eslint-plugin-svelte"]`
- `categories`: `{"correctness":"off"}`
- `env`: `{"builtin":true,"es2024":true}`
- `rules`: 599 entries
- `overrides`: 5

`nostandard` is absent from `jsPlugins` here too. The generated config is not
loadable as-is: oxlint exits with `x Plugin 'nostandard' not found`.
Adding a jsPlugin entry pointing at `src/rules/index.js` also fails because
oxlint requires a default export: `TypeError: Cannot destructure property 'rules'
of 'plugin' as it is undefined`. A wrapper module with
`export {plugin as default}` makes it load.

## @stylistic ids

Preserved verbatim, prefix included. Examples:

- `@stylistic/comma-dangle` -> `["warn",{"arrays":"always-multiline","objects":"always-multiline","imports":"always-multiline","exports":"always-multiline","functions":"only-multiline","importAttributes":"never","dynamicImports":"never"}]`
- `@stylistic/indent` -> `["warn",2]`
- `@stylistic/max-len`
- `@stylistic/semi-spacing`
- 68 `@stylistic/*` rules in the full output, all with the original prefix

## categories

Always present. Both configs emit `{"correctness":"off"}`; no other keys. This is
a violation of the plan rule "do not enable categories".

## details / unmigrated rules

Recommended config skips 9 rules.

Nursery (3): `no-undef`, `no-useless-assignment`, `no-unreachable-loop`.

Unsupported (6): `no-dupe-args`, `no-octal`, `camelcase`, `no-octal-escape`,
`dot-notation`, `no-undef-init`.

Full config skips 217 rules.

Nursery (4): `no-undef`, `no-useless-assignment`, `no-unreachable-loop`,
`unicorn/no-useless-iterator-to-array`.

Unsupported (33): `no-dupe-args`, `no-octal`, `camelcase`, `no-octal-escape`,
`dot-notation`, `no-undef-init`, `unicorn/consistent-class-member-order`,
`unicorn/no-accidental-bitwise-operator`, `unicorn/no-boolean-sort-comparator`,
`unicorn/no-chained-comparison`, `unicorn/no-collection-bracket-access`,
`unicorn/no-constant-zero-expression`, `unicorn/no-double-comparison`,
`unicorn/no-for-loop`, `unicorn/no-invalid-argument-count`,
`unicorn/no-invalid-character-comparison`, `unicorn/no-misrefactored-assignment`,
`unicorn/no-named-default`, `unicorn/no-non-function-verb-prefix`,
`unicorn/no-nonstandard-builtin-properties`,
`unicorn/no-shorthand-property-overrides`, `unicorn/no-transition-all`,
`unicorn/no-undeclared-class-members`,
`unicorn/no-unnecessary-boolean-comparison`,
`unicorn/no-unsafe-promise-all-settled-values`, `unicorn/no-useless-coercion`,
`unicorn/no-useless-concat`, `unicorn/no-useless-template-literals`,
`unicorn/prefer-math-constants`, `unicorn/require-array-sort-compare`,
`unicorn/require-proxy-trap-boolean-return`, `unicorn/template-indent`,
`import-x/order`.

Not implemented (180), all `unicorn/*`:
unicorn/better-dom-traversing, unicorn/class-reference-in-static-methods, unicorn/consistent-boolean-name, unicorn/consistent-compound-words, unicorn/consistent-conditional-object-spread, unicorn/consistent-export-decorator-position, unicorn/consistent-json-file-read, unicorn/consistent-optional-chaining, unicorn/consistent-tuple-labels, unicorn/default-export-style, unicorn/dom-node-dataset, unicorn/expiring-todo-comments, unicorn/isolated-functions, unicorn/logical-assignment-operators, unicorn/no-array-concat-in-loop, unicorn/no-array-from-fill, unicorn/no-array-sort-for-min-max, unicorn/no-array-splice, unicorn/no-asterisk-prefix-in-documentation-comments, unicorn/no-async-iterator-callback, unicorn/no-await-expression-member, unicorn/no-break-in-nested-loop, unicorn/no-computed-property-existence-check, unicorn/no-declarations-before-early-exit, unicorn/no-duplicate-if-branches, unicorn/no-duplicate-loops, unicorn/no-else-return, unicorn/no-empty-file, unicorn/no-for-each, unicorn/no-immediate-return, unicorn/no-invalid-remove-event-listener, unicorn/no-late-static-member-access, unicorn/no-length-as-slice-end, unicorn/no-lonely-if, unicorn/no-negated-condition, unicorn/no-negation-in-equality-check, unicorn/no-nested-ternary, unicorn/no-new-array, unicorn/no-new-buffer, unicorn/no-null, unicorn/no-object-as-default-parameter, unicorn/no-process-exit, unicorn/no-single-promise-in-promise-methods, unicorn/no-static-only-class, unicorn/no-thenable, unicorn/no-this-assignment, unicorn/no-typeof-undefined, unicorn/no-unnecessary-array-flat-depth, unicorn/no-unnecessary-await, unicorn/no-unnecessary-polyfills, unicorn/no-unreadable-array-destructuring, unicorn/no-unreadable-iife, unicorn/no-unused-properties, unicorn/no-useless-error-capture-stack-trace, unicorn/no-useless-fallback-in-spread, unicorn/no-useless-length-check, unicorn/no-useless-promise-resolve-reject, unicorn/no-useless-spread, unicorn/no-useless-switch-case, unicorn/no-useless-undefined, unicorn/prefer-add-event-listener, unicorn/prefer-array-find, unicorn/prefer-array-flat, unicorn/prefer-array-index-of, unicorn/prefer-array-some, unicorn/prefer-at, unicorn/prefer-blob-reading-methods, unicorn/prefer-code-point, unicorn/prefer-date-now, unicorn/prefer-default-parameters, unicorn/prefer-dom-node-append, unicorn/prefer-dom-node-dataset, unicorn/prefer-dom-node-remove, unicorn/prefer-dom-node-text-content, unicorn/prefer-event-target, unicorn/prefer-global-this, unicorn/prefer-includes, unicorn/prefer-keyboard-event-key, unicorn/prefer-logical-operator-over-ternary, unicorn/prefer-math-min-max, unicorn/prefer-math-trunc, unicorn/prefer-modern-dom-apis, unicorn/prefer-modern-math-apis, unicorn/prefer-native-coercion-functions, unicorn/prefer-negative-index, unicorn/prefer-node-protocol, unicorn/prefer-number-properties, unicorn/prefer-object-from-entries, unicorn/prefer-optional-catch-binding, unicorn/prefer-prototype-methods, unicorn/prefer-query-selector, unicorn/prefer-reflect-apply, unicorn/prefer-regexp-test, unicorn/prefer-set-has, unicorn/prefer-set-size, unicorn/prefer-spread, unicorn/prefer-string-replace-all, unicorn/prefer-string-slice, unicorn/prefer-string-starts-ends-with, unicorn/prefer-string-trim-start-end, unicorn/prefer-structured-clone, unicorn/prefer-switch, unicorn/prefer-temporal-conversion, unicorn/prefer-then-catch, unicorn/prefer-toggle-attribute, unicorn/prefer-type-literal-last, unicorn/prefer-unary-minus, unicorn/prefer-unicode-code-point-escapes, unicorn/prefer-url-can-parse, unicorn/prefer-url-href, unicorn/prefer-url-search-parameters, unicorn/prefer-while-loop-condition, unicorn/require-css-escape, unicorn/require-passive-events, unicorn/require-text-decoder-streaming, unicorn/single-line-block-comment-style

## import-x rewrite

All `import-x/*` ids are rewritten to `import/*`; zero `import-x/*` ids remain.
The rules land in one override with `plugins: ["import"]`.

- `import-x/order` is skipped as unsupported, so no `import/order` is emitted
- `import-x/no-cycle` -> `import/no-cycle` with `"off"`
- `import-x/max-dependencies` -> `import/max-dependencies` with `["warn",{"max":10}]`
- `import-x/no-mutable-exports` -> `import/no-mutable-exports` with `"error"`

The import-x `settings` (`import-x/extensions`) are dropped with a warning:
"Settings found under a 'files' pattern — oxlint does not support settings in
overrides and they will be skipped".

## files globs and overrides

Per-file `overrides` are emitted for every config with `files`. Full config:

- vitest files: `["tests/**/*.js","**/*.test.js"]`, 20 rules, `plugins:["vitest"]`, 17 globals
- import-x files: `["src/**/*.js","src/**/*.svelte*","tests/**/*.js"]`, 10 rules, `plugins:["import"]`
- playwright files: `["e2e/**/*.*js"]`, 38 rules, `jsPlugins:["eslint-plugin-playwright"]`, 72 globals
- svelte base files: `["*.svelte","**/*.svelte"]`, 2 rules, `jsPlugins:["eslint-plugin-svelte"]`
- nostandard/svelte files: `["**/*.svelte","**/*.svelte.js","**/*.svelte.ts"]`, 15 rules, `jsPlugins:["eslint-plugin-svelte","@stylistic/eslint-plugin"]`

Same id with different severities across scopes is NOT collapsed. Example:
`no-undefined` is `"error"` at top level and `"off"` in the vitest override.
`@stylistic/indent` is `["warn",2]` at top level and `"off"` in the svelte
override. No same-scope conflict exists in these configs, so same-scope
last-wins could not be observed.

## svelte

Migrate does not crash and does not skip the svelte config. It emits
`jsPlugins:["eslint-plugin-svelte"]` and `svelte/*` ids.

Problem: `eslint-plugin-svelte`'s `flat/recommended` contains
`svelte:recommended:rules`, which has no `files` key (37 rules). Migrate writes
those 37 `svelte/*` rules at the top level, so they apply to every file, not just
`.svelte` files. That is a behavior change.

Migrate also warns `special parser detected: svelte-eslint-parser` and does not
migrate the svelte parser setup.

## Running oxlint on this repo

`npx oxlint -c /tmp/opencode/nostandard-spike/oxlint.json src` fails with
`Plugin 'nostandard' not found`. The recommended output declares
`nostandard/*` rules (from the functional config) without declaring the plugin.

With a wrapper plugin added to `jsPlugins`, oxlint runs on `src`:

- exit code 0 (warnings only)
- 2 diagnostics, both `eslint(max-lines)`
- `src/configs/style.js:194:2` file has 194 lines, max 180
- `src/configs/base.js:185:2` file has 185 lines, max 180

These two files are exempt in the repo's own `eslint.config.js` (`max-lines: off`
for `src/configs/*.js`). That local override is not part of the migrated input,
so these 2 diagnostics only show that the migrated config alone is stricter than
the repo's ESLint setup.

## .gitignore

Verified in a throwaway git repo at `/tmp/opencode/oxlint-gitignore` with
`.gitignore` containing `ignored.js`: oxlint reported only `kept.js` and did not
report `ignored.js`. Oxlint respects `.gitignore` by default.

## Plan violations found

- `categories` is present and non-empty (`{"correctness":"off"}`).
- `svelte/*` rules are present, and 37 of them are global instead of file-scoped.
- The custom `nostandard` plugin is missing from `jsPlugins`; generated config
  does not load without a hand-written wrapper.
- `import-x/*` ids are renamed to `import/*`, and `import-x/order` is dropped.
- `settings` under `files` are silently dropped.
- 217 rules are not migrated in the full config.
- Per-file `files` globs become `overrides`; repo-local overrides from
  `eslint.config.js` (for example `max-lines: off` for `src/configs/*.js`) are
  not part of the migrated input, so oxlint flags 2 files ESLint accepts.

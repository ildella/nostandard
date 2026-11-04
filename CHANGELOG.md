# Changelog

All notable changes to this project are documented in this file.

## 1.5.1

### Changed

- `nostandard/restricted-syntax`: removed the console spy bans. Spying on
  `console` with `spyOn(console, 'log')` and `jest.spyOn(console, 'log')` is
  now allowed; the default list keeps only the accessor and
  `Promise.resolve(null)` bans.
- `svelte` config: applies `nostandard/restricted-syntax` to `**/*.svelte`,
  `**/*.svelte.js` and `**/*.svelte.ts`, with the getter/setter (accessor)
  bans off. Only the `Promise.resolve(null)` ban stays.
- `svelte` config: file patterns now include `**/*.svelte.ts`, and the config
  registers the `nostandard` plugin so the rule works without the base config.
- `restricted-syntax` selectors are now exported as `accessorSyntaxList` and
  `promiseSyntaxList`, with `restrictedSyntaxList` composing both.

### Docs

- `docs/custom-rules.md` and `docs/globals.md` no longer list console spying
  as a ban, and document the svelte override.

### Dependencies

- `eslint-plugin-playwright` 2.12.2, `eslint-plugin-svelte` 3.24.0,
  `globals` 17.14.0, `vitest` 5.1.0.

## 1.5.0

### Added

- New `nostandard/no-empty-sentinel` custom rule: bans `null` and `''` used as
  a return value (including arrow bodies and ternary branches), an assignment
  or initializer, or an operand of `||` / `??`. Enabled in the `functional`
  config as `warn`.

### Changed

- `functional` config: registers the `nostandard` plugin and sets
  `no-param-reassign` to `['warn', {props: true}]`.
- `base` config: added `no-useless-catch`, `no-useless-computed-key`,
  `no-useless-escape` and `no-useless-return`, consolidated with the other
  `no-useless-*` rules.
- `unicorn` config: switched from the renamed `unicorn/no-array-for-each` to
  `unicorn/no-for-each`.

### Dependencies

- `eslint` 10.14.0, `svelte` 5.57.3, Yarn 6.0.0-rc.23.

## 1.4.1

### Added

- New `nostandard/restricted-syntax` custom rule: a copy of the core
  `no-restricted-syntax` under the `nostandard` ruleId, so a project can keep
  its own `no-restricted-syntax` without replacing the shared ban list.
  Enabled in `base` as `warn` with the accessor, console spy and
  `Promise.resolve(null)` selectors.
- New `nostandard/no-dynamic-import` custom rule: bans `ImportExpression`, so
  the dynamic import ban has a name that can be disabled per project or per
  file. Enabled in `base` as `warn`.

### Changed

- `import-x` config: `import-x/max-dependencies` lowered from 20 to 10.

### Fixed

- `restricted-syntax`: the `jest.spyOn` selector matched `callee.name`, which
  is never the case for a member call, so it never fired. It now matches
  `callee.property.name`, and `spyOn(console, ...)` has its own selector.

### Dependencies

- Bumped dependencies and the package version to the 1.4 line.

// Rule ids that reached the generated Oxlint config and then failed the
// diagnostic diff against ESLint. A denied id must stay out of the off-set,
// because Oxlint no longer enforces it and ESLint still has to.
// vitest/no-conditional-expect: the native Oxlint rule accepts no options and
// rejects the config with "This rule does not accept configuration options."
// Our ESLint config passes {expectAssertions: true}, so denying the id keeps
// the rule enabled on ESLint only.
// vitest/valid-expect: Oxlint's native rule reports the two-argument
// expect(actual, message) form as "Expect takes at most 1 argument". The
// @vitest/eslint-plugin rule emits nothing for the same line, so this is an
// Oxlint false positive. Denying the id keeps the rule on ESLint only.
export const DENY_LIST = new Set([
  'vitest/no-conditional-expect',
  'vitest/valid-expect',
])

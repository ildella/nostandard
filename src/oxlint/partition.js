import {collectEnabledRules, isOff} from './collect-rules.js'

const ESLINT_PREFIX = 'eslint/'
const SEPARATOR = '\u0000'

const normalizeId = id => id.startsWith(ESLINT_PREFIX)
  ? id.slice(ESLINT_PREFIX.length)
  : id

const enabledIdsOf = rules => [...new Set(Object.entries(rules ?? {})
  .filter(([, value]) => !isOff(value))
  .map(([id]) => normalizeId(id)))].sort()

const scopeOf = (files, rules) => ({files, ids: enabledIdsOf(rules)})

const filesKey = files => files === null
  ? ''
  : [...files].sort().join(SEPARATOR)

const mergeScopes = scopes => {
  const grouped = new Map()
  scopes.forEach(scope => {
    const key = filesKey(scope.files)
    const entry = grouped.get(key) ?? {files: scope.files, ids: []}
    entry.ids = [...new Set([...entry.ids, ...scope.ids])].sort()
    grouped.set(key, entry)
  })
  return [...grouped.values()]
}

const nonEmpty = ({ids}) => ids.length > 0

export const enabledByScope = config => [
  scopeOf(null, config.rules),
  ...(config.overrides ?? []).map(
    override => scopeOf(override.files, override.rules),
  ),
].filter(nonEmpty)

export const eslintScopesOf = flatConfig => mergeScopes(
  flatConfig.map(config => scopeOf(config.files ?? null, config.rules)),
).filter(nonEmpty)

const sameFiles = (left, right) => filesKey(left) === filesKey(right)

const filesLabel = files => files === null ? 'all files' : files.join(', ')

const scopeFor = (eslintScopes, files) =>
  eslintScopes.find(scope => sameFiles(scope.files, files))

export const assertScopesKnown = (eslintScopes, oxlintScopes) => {
  oxlintScopes.forEach(({files, ids}) => {
    const scope = scopeFor(eslintScopes, files)
    if (!scope)
      throw new Error(
        `Oxlint scope on ${filesLabel(files)} is missing from the ESLint side`,
      )
    const unknown = ids.find(id => !scope.ids.includes(id))
    if (!unknown)
      return
    throw new Error(
      `Oxlint rule "${unknown}" on ${filesLabel(files)} is missing ` +
      'from the ESLint side',
    )
  })
}

export const assertKnown = (oxlintIds, eslintEnabled) => {
  const unknown = oxlintIds.find(id => !eslintEnabled.has(id))
  if (!unknown)
    return
  throw new Error(
    `Oxlint rule "${unknown}" is not enabled by the ESLint slice`,
  )
}

export const checkPartition = (eslintConfig, oxlintConfig) => {
  const oxlintScopes = enabledByScope(oxlintConfig)
  assertScopesKnown(eslintScopesOf(eslintConfig), oxlintScopes)
  const oxlintIds = [...new Set(
    oxlintScopes.flatMap(scope => scope.ids),
  )].sort()
  const eslintEnabled = collectEnabledRules(eslintConfig)
  assertKnown(oxlintIds, eslintEnabled)
  const remainder = [...eslintEnabled.keys()]
    .filter(id => !oxlintIds.includes(id))
    .sort()
  return {oxlintIds, remainder}
}

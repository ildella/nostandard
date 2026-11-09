const SEVERITIES = {0: 'off', 1: 'warn', 2: 'error'}

const asArray = value => Array.isArray(value) ? value : [value]

export const normalizeSeverity = value => {
  const [severity, ...options] = asArray(value)
  return [SEVERITIES[severity] ?? severity, ...options]
}

export const isOff = value => normalizeSeverity(value)[0] === 'off'

const rulesOf = config => Object.entries(config.rules ?? {})

export const collectEnabledRules = flatConfigArray => new Map(
  flatConfigArray
    .flatMap(rulesOf)
    .map(([id, value]) => [id, normalizeSeverity(value)])
    .filter(([, value]) => !isOff(value)),
)

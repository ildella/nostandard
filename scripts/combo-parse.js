const OXLINT_ERROR = 'error'
const IMPORT_ALIAS = 'import'
const IMPORT_NAME = 'import-x'

const severityOf = value => value === 2 ? 2 : 1

const messageToDiagnostic = (file, message) => ({
  file,
  ruleId: message.ruleId,
  severity: severityOf(message.severity),
  line: message.line,
})

const messagesOf = file =>
  file.messages
    .filter(message => message.ruleId)
    .map(message => messageToDiagnostic(file.filePath, message))

export const parseEslint = text =>
  JSON.parse(text).flatMap(messagesOf)

const splitCode = code => {
  const open = code.indexOf('(')
  if (open === -1)
    return ['', code]
  return [code.slice(0, open), code.slice(open + 1, code.length - 1)]
}

const pluginOf = plugin => plugin === IMPORT_ALIAS ? IMPORT_NAME : plugin

const ruleIdOf = code => {
  const [plugin, rule] = splitCode(code)
  if (plugin === '' || plugin === 'eslint')
    return rule
  return `${pluginOf(plugin)}/${rule}`
}

const lineOf = diagnostic => diagnostic.labels?.[0]?.span?.line

export const parseOxlint = text =>
  JSON.parse(text).diagnostics.map(diagnostic => ({
    file: diagnostic.filename,
    ruleId: ruleIdOf(diagnostic.code),
    severity: diagnostic.severity === OXLINT_ERROR ? 2 : 1,
    line: lineOf(diagnostic),
  }))

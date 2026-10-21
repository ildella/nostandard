# Custom rules

NoStandard ships three custom rules from the `nostandard` plugin.

## `nostandard/max-destructured-properties`

`max-params` counts formal parameters only, so a single options object with
a dozen keys looks like one parameter. This rule counts the properties
destructured in a function parameter instead.

Enabled in `base` as `['warn', {max: 3}]`.

```js
// warn: destructures 4 properties, max is 3
const issueLaunch = ({label, planPath, workspace, card}) => {}
```

The message asks to split the function: moving the destructuring into the
body leaves the payload unchanged and simply hides the count.

### Options

- `max` (integer, default `3`) — how many properties a single parameter may
  destructure.

```js
{
  rules: {
    'nostandard/max-destructured-properties': ['warn', {max: 8}],
  },
}
```

### Details

- Applies to `FunctionDeclaration`, `FunctionExpression` and
  `ArrowFunctionExpression` parameters.
- Default parameters are unwrapped: `({a, b} = {}) => {}` is counted.
- `RestElement` (`...rest`) is not counted.
- Only top-level keys of the parameter's `ObjectPattern` are counted.
- Destructuring outside parameters (`const {a} = obj`) is not counted.

## `nostandard/no-dynamic-import`

Dynamic `import()` is a second, invisible module graph: no static analysis of
the specifier, a runtime failure mode where a static import gives a build
error, and code splitting that nobody declared. This rule bans the
`ImportExpression` node outright, whatever the specifier.

Enabled in `base` as `'warn'`.

```js
// warn: Dynamic import() is banned.
const mod = await import(specifier)
```

If a project genuinely needs lazy loading, turn the rule off for that project
or for the specific file — instead of banning it in one project with a
`no-restricted-syntax` selector, which is the same ban without a name.

```js
{
  rules: {
    'nostandard/no-dynamic-import': 'off',
  },
}
```

### Details

- Takes no options.
- Matches `ImportExpression`, the AST node introduced by ES2020: dynamic
  imports with a literal specifier, a computed one, a template literal and a
  second `options` argument are all caught.
- Static `import` statements are not affected.
- A dynamic import hidden behind `eval`, `new Function` or a bundled API is
  out of scope: this is an AST rule, not a runtime policy.

## `nostandard/restricted-syntax`

A copy of the core `no-restricted-syntax` under our own ruleId, same options
and same selector language (ESQuery). It exists for one reason: the core rule
is a single global `ruleId`, so a project that configures its own
`no-restricted-syntax` **replaces** the base one — flat config does not merge
rules. With this rule the two can coexist: the project keeps
`no-restricted-syntax` for its local bans, and ours stays on.

Enabled in `base` as `'warn'` with the selectors below.

| Selector | Why |
| --- | --- |
| `MethodDefinition[kind="get"]`, `MethodDefinition[kind="set"]` | no accessors on classes |
| `Property[kind="get"]`, `Property[kind="set"]` | no accessors on object literals |
| `CallExpression[callee.name='spyOn'][arguments.0.name='console']` | no spying on console |
| `CallExpression[callee.property.name='spyOn'][arguments.0.name='console']` | same, for `jest.spyOn` / `vi.spyOn` |
| `Promise.resolve(null)` | use an exception or a real value |

Options are the core rule's, unchanged:

```js
{
  rules: {
    'nostandard/restricted-syntax': [
      'error',
      'WithStatement',
      {selector: 'TryStatement', message: 'No try/catch blocks.'},
    ],
  },
}
```

A string entry gets the core rule's generated message
(`Using 'Selector' is not allowed.`).

### Details

- The default list lives in `src/configs/restricted-syntax.js`.
- Severity is yours: `'off'` silences the whole list for a project, and a
  project-level array replaces it.
- It is still **one** ruleId for all entries: `eslint-disable-next-line
  nostandard/restricted-syntax` silences the whole list on that line. Use the
  named rules (`no-dynamic-import`, `no-accessors`) when you need per-ban
  disables.
- Accessors are a strong opinion. If your project has classes, ORM entities or
  framework components with getters, override the rule or narrow the list.

The plugin is also exported directly, for advanced config composition:

```js
import {plugin} from 'eslint-nostandard/plugin'
```

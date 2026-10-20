# Custom rules

NoStandard ships two custom rules from the `nostandard` plugin.

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

The plugin is also exported directly, for advanced config composition:

```js
import {plugin} from 'eslint-nostandard/plugin'
```

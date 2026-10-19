# Custom rules

NoStandard ships one custom rule from the `nostandard` plugin.

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

The plugin is also exported directly, for advanced config composition:

```js
import {plugin} from 'eslint-nostandard/plugin'
```

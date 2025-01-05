# NoStandard

A consolidation of my old [eslint configurations](https://github.com/ildella/eslint-config-node-moar) ported to ESLint 9+ and Flat configuration. 

The overall project structure has been taken from [NeoStandard](https://github.com/neostandard/neostandard) from which I also borrowed some additional `base` and `style` rules that despite were not in my original ruleset, were not causing any issue with my current projects. They have all been converted to the Golden Rule. 

## Usage

```shell
yarn add -D @ildella/nostandard

# Or
pnpm add -D @ildella/nostandard

# Or, if you are an horrible person:
npm install -D @ildella/nostandard
```

And this is and exampl on how to use it in your `eslint-config.js`.

```js
import nostandard from '@ildella/nostandard'

export default [
  {
    name: 'Your project name',
    // ...
  },
  ...nostandard(),
  {
    // languageOptions: {...},
    // plugins: {...},
    // rules: {...}
  },
  {
    name: 'Testing config...',
    files: ['tests/**/*.*js'],
    // ...mytestlib.configs['flat/recommended'],
    // rules: {...},
  },
]
````

## Why not NeoStandard then?

There are too many useless dependencies. Especially I do not consider usable anything that gives for granted that developers use React, or any other specific framework. Why would I want anytning JSX or React in my NodeJS or Svelte projects? 

For the same reason, I do not want `eslint-plugin-n` as a default dependency.

Finally, they do not respect my golden rule.

## Golden Rule

If it breaks, it's an error. 
If it does not break, it's a warning. 

With one and only one special exception, as all good rules must have an exception. 

## What's in here?

For now only basic ESLint basic and [Stylistic](https://eslint.style/)

I will consider adding more stuff here like `Promise`, `eslint-plugin-import-x` and `security`.

I will also create a NodeJS dedicated configuration, based on `eslint-plugin-n`, `eslint-plugin-functional` and `eslint-plugin-unicorn`, refactoring them out of my current projects into a companion library to NoStandard.

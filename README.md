# Jest preset for MongoDB

A Jest preset making it easier to run Jest tests that rely on a real instance of MongoDB.

You can safely run multiple test spec in parallel: each Jest worker will connect to a different database. You may still want to clear data after running each test spec.

# How to use this preset

You can specify this preset in your Jest `jest.config.js` configuration file:

```js
module.exports = {
  preset: "@tseisel/jest-mongodb",
}
```

If you are already using a preset, you can apply this one with the following code:

```js
const preset = require("@tseisel/jest-mongodb/jest-preset")

module.exports = {
  ...preset,
  preset: "some-preset",
}
```

If you do so, make sure that you don't override any of the following properties:

- `globalSetup`
- `globalTeardown`
- `testEnvironment`

# Configuration

You can specify which version of the MongoDB binary you'd like to use by configuring it in your `package.json`.

```json
{
  "@tseisel/jest-mongodb": {
    "version": "4.4.1"
  }
}
```

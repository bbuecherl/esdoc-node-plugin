# esdoc-node-plugin

Node.js Module Plugin for [ESDoc](http://esdoc.org) to include references to
all internal node modules (like "events", "buffer", ...) as builtin externals
in your ESDoc documentation and all your npm dependencies (like "esdoc", ...).

## Usage

Install it:

```sh
npm install esdoc-node-plugin --save-dev
```

And include it in the ``plugin`` array of ``esdoc.json``:

```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    { "name": "esdoc-node-plugin", "option": {
      "base": ".",
      "devDependencies": false
    }}
  ]
}
```

## Options

### `base : string | boolean`

absolute or relative path to the package.json of your project. If `false`, no
npm dependencies will be included.
*default: false*

### `devDependencies : boolean`

include npm development dependencies. *default: false*

## License: [MIT](http://bbuecherl.mit-license.org)

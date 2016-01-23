# esdoc-node-plugin

Node.js Module Plugin for [ESDoc](http://esdoc.org) to include references to
all internal node modules (like "events", "buffer", ...) as builtin externals
in your ESDoc documentation.

## Usage

Install it:

```sh
npm install esdoc-node-plugin
```

And include it in the ``plugin`` property of ``esdoc.json``:

```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    { "name": "esdoc-node-plugin" }
  ]
}
```

## License: [MIT](http://bbuecherl.mit-license.org)

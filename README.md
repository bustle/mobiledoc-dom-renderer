## Mobiledoc DOM Renderer [![Build Status](https://travis-ci.org/bustlelabs/mobiledoc-dom-renderer.svg?branch=master)](https://travis-ci.org/bustlelabs/mobiledoc-dom-renderer)

This is a DOM renderer for the [Mobiledoc](https://github.com/bustlelabs/content-kit-editor/blob/master/MOBILEDOC.md) format used
by [Mobiledoc-Kit](https://github.com/bustlelabs/mobiledoc-kit).

The renderer is a small library intended for use in browser clients.

### Usage

```
var mobiledoc = {
  version: "0.1",
  sections: [
    [         // markers
      ['B']
    ],
    [         // sections
      [1, 'P', [ // array of markups
        // markup
        [
          [0],          // open markers (by index)
          0,            // close count
          'hello world'
        ]
      ]
    ]
  ]
};
var renderer = new MobiledocDOMRenderer();
var cards = {};
var rendered = renderer.render(mobiledoc, document.createElement('div'), cards);
document.getElementById('output').appendChild(rendered);
// renders <div><p><b>hello world</b></b></div>
// into 'output' element
```

### Tests

 * `npm test`

### Releasing

* `npm version patch` or `minor` or `major`
* `npm run build`
* `npm run update-changelog`
* `git push bustle --tags`
* `npm publish`

## Mobiledoc DOM Renderer [![Build Status](https://travis-ci.org/bustlelabs/mobiledoc-dom-renderer.svg?branch=master)](https://travis-ci.org/bustlelabs/mobiledoc-dom-renderer)

This is a runtime renderer for the `mobiledoc` format.
It renders mobiledoc to DOM elements.

It is intended to be a small libraray that is run client-side in a browser that wants to display mobiledoc.

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
var renderer = new DOMRenderer();
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
* `git push bustle --tags`
* `npm publish`

## Mobiledoc DOM Renderer [![Build Status](https://travis-ci.org/bustlelabs/mobiledoc-dom-renderer.svg?branch=master)](https://travis-ci.org/bustlelabs/mobiledoc-dom-renderer)

This is a DOM renderer for the [Mobiledoc format](https://github.com/bustlelabs/mobiledoc-kit/blob/master/MOBILEDOC.md) used
by [Mobiledoc-Kit](https://github.com/bustlelabs/mobiledoc-kit).

To learn more about Mobiledoc cards and renderers, see the **[Mobiledoc Cards docs](https://github.com/bustlelabs/mobiledoc-kit/blob/master/CARDS.md)**.

The renderer is a small library intended for use in browser clients.

### Usage

```
var mobiledoc = {
  version: "0.2.0",
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
var renderer = new MobiledocDOMRenderer({cards: []});
var rendered = renderer.render(mobiledoc);
var result = rendered.result;
document.getElementById('output').appendChild(result);
// renders <div><p><b>hello world</b></b></div>
// into 'output' element
```

The Renderer constructor accepts a single object with the following optional properties:
  * `cards` [array] - The list of card objects that the renderer may encounter in the mobiledoc
  * `cardOptions` [object] - Options to pass to cards when they are rendered
  * `unknownCardHandler` [function] - Will be called when any unknown card is enountered

The return value from `renderer.render(mobiledoc)` is an object with two properties:
  * `result` [DOM Node] - The rendered result
  * `teardown` [function] - When called, this function will tear down the rendered mobiledoc and call any teardown handlers that were registered by cards when they were rendered

### Tests

 * `npm test`

### Releasing

* `npm version patch` or `minor` or `major`
* `npm run build`
* `npm run update-changelog`
* `git push bustle --tags`
* `npm publish`

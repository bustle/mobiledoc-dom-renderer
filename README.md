# Mobiledoc DOM Renderer

This is a runtime renderer for the `mobiledoc` format.
It renders mobiledoc to DOM elements.

It is intended to be a small libraray that is run client-side in a browser that wants to display mobiledoc.

## Usage

```
var mobiledoc = [
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
];
var renderer = new DOMRenderer();
var rendered = renderer.render(mobiledoc);
document.getElementById('output').appendChild(rendered);
// renders <div><p><b>hello world</b></b></div>
// into 'output' element
```

## Tests

 * `npm test`

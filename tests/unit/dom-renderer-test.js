/* global QUnit */

const { test } = QUnit;

import DOMRenderer from 'mobiledoc-dom-renderer';

let renderer;
QUnit.module('Unit: Mobiledoc DOM Renderer', {
  beforeEach() {
    renderer = new DOMRenderer();
  }
});

test('it exists', (assert) => {
  assert.ok(DOMRenderer, 'class exists');
  assert.ok(renderer, 'instance exists');
});

test('renders an empty mobiledoc', (assert) => {
  let mobiledoc = [
    [], // markers
    []  // sections
  ];
  let rendered = renderer.render(mobiledoc);

  assert.ok(rendered, 'renders output');
  assert.equal(rendered.childNodes.length, 0,
               'has no sections');
});

test('renders a mobiledoc without markers', (assert) => {
  let mobiledoc = [
    [], // markers
    [   // sections
      [1, 'P', [
        [[], 0, 'hello world']]
      ]
    ]
  ];
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered.childNodes.length, 1,
               'renders 1 section');
  assert.equal(rendered.childNodes[0].tagName, 'P',
               'renders a P');
  assert.equal(rendered.childNodes[0].textContent, 'hello world',
               'renders the text');
});

test('renders a mobiledoc with simple (no attributes) marker', (assert) => {
  let mobiledoc = [
    [        // markers
      ['B'],
    ],
    [   // sections
      [1, 'P', [
        [[0], 1, 'hello world']]
      ]
    ]
  ];
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered.childNodes.length, 1,
               'renders 1 section');
  let sectionEl = rendered.childNodes[0];

  assert.equal(sectionEl.innerHTML, '<b>hello world</b>');
});

test('renders a mobiledoc with complex (has attributes) marker', (assert) => {
  let mobiledoc = [
    [        // markers
      ['A', ['href', 'http://google.com']],
    ],
    [   // sections
      [1, 'P', [
          [[0], 1, 'hello world']
      ]]
    ]
  ];
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered.childNodes.length, 1,
               'renders 1 section');
  let sectionEl = rendered.childNodes[0];

  assert.equal(sectionEl.innerHTML, '<a href="http://google.com">hello world</a>');
});

test('renders a mobiledoc with multiple markups in a section', (assert) => {
  let mobiledoc = [
    [        // markers
      ['B'],
      ['I']
    ],
    [   // sections
      [1, 'P', [
        [[0], 0, 'hello '], // b
        [[1], 0, 'brave '], // b+i
        [[], 1, 'new '], // close i
        [[], 1, 'world'] // close b
      ]]
    ]
  ];
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered.childNodes.length, 1,
               'renders 1 section');
  let sectionEl = rendered.childNodes[0];

  assert.equal(sectionEl.innerHTML, '<b>hello <i>brave new </i>world</b>');
});

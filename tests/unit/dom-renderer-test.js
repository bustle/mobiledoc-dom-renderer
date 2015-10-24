/* global QUnit */

const { test } = QUnit;
const MOBILEDOC_VERSION = '0.2.0';

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
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      []  // sections
    ]
  };
  let rendered = renderer.render(mobiledoc);

  assert.ok(rendered, 'renders output');
  assert.equal(rendered.childNodes.length, 0,
               'has no sections');
});

test('renders a mobiledoc without markers', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [   // sections
        [1, 'P', [
          [[], 0, 'hello world']]
        ]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered.childNodes.length, 1,
               'renders 1 section');
  assert.equal(rendered.childNodes[0].tagName, 'P',
               'renders a P');
  assert.equal(rendered.childNodes[0].textContent, 'hello world',
               'renders the text');
});

test('renders a mobiledoc with simple (no attributes) marker', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [        // markers
        ['B'],
      ],
      [        // sections
        [1, 'P', [
          [[0], 1, 'hello world']]
        ]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered.childNodes.length, 1,
               'renders 1 section');
  let sectionEl = rendered.childNodes[0];

  assert.equal(sectionEl.innerHTML, '<b>hello world</b>');
});

test('renders a mobiledoc with complex (has attributes) marker', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [        // markers
        ['A', ['href', 'http://google.com']],
      ],
      [        // sections
        [1, 'P', [
            [[0], 1, 'hello world']
        ]]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered.childNodes.length, 1,
               'renders 1 section');
  let sectionEl = rendered.childNodes[0];

  assert.equal(sectionEl.innerHTML, '<a href="http://google.com">hello world</a>');
});

test('renders a mobiledoc with multiple markups in a section', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [        // markers
        ['B'],
        ['I']
      ],
      [        // sections
        [1, 'P', [
          [[0], 0, 'hello '], // b
          [[1], 0, 'brave '], // b+i
          [[], 1, 'new '], // close i
          [[], 1, 'world'] // close b
        ]]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered.childNodes.length, 1,
               'renders 1 section');
  let sectionEl = rendered.childNodes[0];

  assert.equal(sectionEl.innerHTML, '<b>hello <i>brave new </i>world</b>');
});

test('renders a mobiledoc with image section', (assert) => {
  let url = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";
  let mobiledoc = {
    versions: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [2, url]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc);
  assert.equal(rendered.childNodes.length, 1,
               'renders 1 section');
  let sectionEl = rendered.childNodes[0];

  assert.equal(sectionEl.src, url);
});

test('renders a mobiledoc with card section', (assert) => {
  assert.expect(3);
  let cardName = 'title-card';
  let payload = {
    name: 'bob'
  };
  let TitleCard = {
    name: cardName,
    display: {
      setup(element, options, env, setupPayload) {
        assert.deepEqual(payload, setupPayload);
        element.innerHTML = setupPayload.name;
      }
    }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [10, cardName, payload]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc, document.createElement('div'), {
    [cardName]: TitleCard
  });
  assert.equal(rendered.childNodes.length, 1,
               'renders 1 section');
  let sectionEl = rendered.childNodes[0];

  assert.equal(sectionEl.innerHTML, payload.name);
});

test('renders a mobiledoc with card section and no payload', (assert) => {
  assert.expect(3);
  let cardName = 'title-card';
  let TitleCard = {
    name: cardName,
    display: {
      setup(element, options, env, setupPayload) {
        assert.deepEqual({}, setupPayload);
        element.innerHTML = '';
      }
    }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [10, cardName]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc, document.createElement('div'), {
    [cardName]: TitleCard
  });
  assert.equal(rendered.childNodes.length, 1,
               'renders 1 section');
  let sectionEl = rendered.childNodes[0];

  assert.equal(sectionEl.innerHTML, '');
});

test('when passed an array of cards, throws', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      []
    ]
  };
  let cards = [{name: 'test-card'}];
  let element = document.createElement('div');

  assert.throws(() => {
    renderer.render(mobiledoc, element, cards);
  }, /cards.*must be passed as an object/);
});

test('renders a mobiledoc with default image section', (assert) => {
  assert.expect(3);
  let cardName = 'image';
  let payload = {
    src: 'http://example.org/foo.jpg'
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [10, cardName, payload]
      ]
    ]
  };
  let rendered = renderer.render(mobiledoc, document.createElement('div'));
  assert.equal(rendered.childNodes.length, 1,
               'renders 1 section');
  let sectionEl = rendered.childNodes[0];

  assert.equal(sectionEl.firstChild.tagName, 'IMG');
  assert.equal(sectionEl.firstChild.src, 'http://example.org/foo.jpg');
});

test('renders mobiledoc with lists', (assert) => {
  const mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [3, 'ul', [
          [[[], 0, 'first item']],
          [[[], 0, 'second item']],
        ]]
      ]
    ]
  };
  const rendered = renderer.render(mobiledoc, document.createElement('div'));
  assert.equal(rendered.childNodes.length, 1, 'renders 1 section');

  const section = rendered.childNodes[0];
  assert.equal(section.tagName, 'UL');

  const items = section.childNodes;
  assert.equal(items.length, 2, '2 list items');

  assert.equal(items[0].tagName, 'LI', 'correct tagName for item 1');
  assert.equal(items[0].childNodes[0].textContent, 'first item',
               'correct text node for item 1');

  assert.equal(items[1].tagName, 'LI', 'correct tagName for item 2');
  assert.equal(items[1].childNodes[0].textContent, 'second item',
               'correct text node for item 2');
});

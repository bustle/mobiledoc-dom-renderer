/* global QUnit, SimpleDOM */

import Renderer from 'mobiledoc-dom-renderer';
import { RENDER_TYPE } from 'mobiledoc-dom-renderer';
import ImageCard from 'mobiledoc-dom-renderer/cards/image';
import {
  MARKUP_SECTION_TYPE,
  LIST_SECTION_TYPE,
  CARD_SECTION_TYPE,
  IMAGE_SECTION_TYPE
} from 'mobiledoc-dom-renderer/utils/section-types';
import {
  innerHTML,
  outerHTML,
  childNodesLength,
  escapeQuotes
} from '../../helpers/dom';
import {
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from 'mobiledoc-dom-renderer/utils/marker-types';

const { test, module } = QUnit;
const MOBILEDOC_VERSION_0_3_0 = '0.3.0';
const MOBILEDOC_VERSION_0_3_1 = '0.3.1';
const dataUri = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";


let renderer;

// Add tests that should run with both simple-dom and
// the window.document in this function.
function generateTests() {

test('renders an empty mobiledoc', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [],
    sections: []
  };
  let { result: rendered } = renderer.render(mobiledoc);

  assert.ok(!!rendered, 'renders result');
  assert.equal(childNodesLength(rendered), 0, 'has no sections');
});

test('renders a mobiledoc without markups', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, [], 0, 'hello world']]
      ]
    ]
  };
  let renderResult = renderer.render(mobiledoc);
  let { result: rendered } = renderResult;
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  assert.equal(rendered.firstChild.tagName, 'P',
               'renders a P');
  assert.equal(rendered.firstChild.firstChild.nodeValue, 'hello world',
               'renders the text');
});

test('renders 0.3.0 markup section "pull-quote" as div with class', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'pull-quote', [
        [MARKUP_MARKER_TYPE, [], 0, 'hello world']]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.firstChild;

  assert.equal(outerHTML(sectionEl), '<div class="pull-quote">hello world</div>');
});

test('renders 0.3.1 markup section "pull-quote" as div with class', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_1,
    atoms: [],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'pull-quote', [
        [MARKUP_MARKER_TYPE, [], 0, 'hello world']]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.firstChild;

  assert.equal(outerHTML(sectionEl), '<div class="pull-quote">hello world</div>');
});

test('renders markup section "aside"', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_1,
    atoms: [],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'aside', [
        [MARKUP_MARKER_TYPE, [], 0, 'hello world']]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.firstChild;

  assert.equal(outerHTML(sectionEl), '<aside>hello world</aside>');
});

test('renders a mobiledoc with simple (no attributes) markup', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [
      ['B']
    ],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, [0], 1, 'hello world']]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.firstChild;

  assert.equal(innerHTML(sectionEl), '<b>hello world</b>');
});

test('renders a mobiledoc with complex (has attributes) markup', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [
      ['A', ['href', 'http://google.com']],
    ],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, [0], 1, 'hello world']
      ]]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.firstChild;

  assert.equal(innerHTML(sectionEl), '<a href="http://google.com">hello world</a>');
});

test('renders a mobiledoc with multiple markups in a section', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [
      ['B'],
      ['I']
    ],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, [0], 0, 'hello '], // b
        [MARKUP_MARKER_TYPE, [1], 0, 'brave '], // b+i
        [MARKUP_MARKER_TYPE, [], 1, 'new '], // close i
        [MARKUP_MARKER_TYPE, [], 1, 'world'] // close b
      ]]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.firstChild;

  assert.equal(innerHTML(sectionEl), '<b>hello <i>brave new </i>world</b>');
});

test('renders a mobiledoc with image section', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [],
    sections: [
      [IMAGE_SECTION_TYPE, dataUri]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.firstChild;

  assert.equal(sectionEl.src, dataUri);
});

test('renders a mobiledoc with built-in image card', (assert) => {
  assert.expect(3);
  let cardName = ImageCard.name;
  let payload = { src: dataUri };
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [
      [cardName, payload]
    ],
    markups: [],
    sections: [
      [CARD_SECTION_TYPE, 0]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.firstChild;

  assert.equal(sectionEl.tagName, 'IMG');
  assert.equal(sectionEl.src, dataUri);
});

test('render mobiledoc with list section and list items', (assert) => {
  const mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [],
    sections: [
      [LIST_SECTION_TYPE, 'ul', [
        [[MARKUP_MARKER_TYPE, [], 0, 'first item']],
        [[MARKUP_MARKER_TYPE, [], 0, 'second item']]
      ]]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc, document.createElement('div'));
  assert.equal(childNodesLength(rendered), 1, 'renders 1 section');

  const section = rendered.firstChild;
  assert.equal(section.tagName, 'UL');

  assert.equal(childNodesLength(section), 2, '2 list items');

  const items = section.childNodes;
  assert.equal(items.item(0).tagName, 'LI', 'correct tagName for item 1');
  assert.equal(items.item(0).firstChild.nodeValue, 'first item',
               'correct text node for item 1');

  assert.equal(items.item(1).tagName, 'LI', 'correct tagName for item 2');
  assert.equal(items.item(1).firstChild.nodeValue, 'second item',
               'correct text node for item 2');
});

test('renders a mobiledoc with card section', (assert) => {
  assert.expect(9);
  let cardName = 'title-card';
  let expectedPayload = { name: 'bob' };
  let expectedOptions = { foo: 'bar' };
  let expectedDom = window.document;

  let TitleCard = {
    name: cardName,
    type: 'dom',
    render: ({env, payload, options}) => {
      assert.deepEqual(payload, expectedPayload, 'correct payload');
      assert.deepEqual(options, expectedOptions, 'correct options');
      assert.equal(env.name, cardName, 'correct name');
      assert.ok(!env.isInEditor, 'isInEditor correct');
      assert.ok(!!env.onTeardown, 'has onTeardown hook');
      assert.ok(!!env.didRender, 'has didRender hook');
      assert.deepEqual(env.dom, expectedDom, 'env has dom');

      return document.createTextNode(payload.name);
    }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [
      [cardName, expectedPayload]
    ],
    markups: [],
    sections: [
      [CARD_SECTION_TYPE, 0]
    ]
  };

  renderer = new Renderer({cards: [TitleCard], cardOptions: expectedOptions, dom: expectedDom});
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1, 'renders 1 section');
  assert.equal(innerHTML(rendered), expectedPayload.name);
});

test('throws when given invalid card type', (assert) => {
  let cardName = 'bad';
  let card = {
    name: cardName,
    type: 'text',
    render() {}
  };
  let cards = [card];
  assert.throws(
    () => { new Renderer({cards}) }, // jshint ignore: line
    new RegExp(`Card "${cardName}" must be of type "${RENDER_TYPE}"`)
  );
});

test('throws when given card without `render`', (assert) => {
  let cardName = 'bad';
  let card = {
    name: cardName,
    type: RENDER_TYPE,
    render: undefined
  };
  let cards = [card];
  assert.throws(
    () => { new Renderer({cards}) }, // jshint ignore: line
    new RegExp(`Card "${cardName}" must define \`render\``)
  );
});

test('throws if card render returns invalid result', (assert) => {
  let card = {
    name: 'bad',
    type: 'dom',
    render() { return 'string'; }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [
      [card.name]
    ],
    markups: [],
    sections: [
      [CARD_SECTION_TYPE, 0]
    ]
  };

  renderer = new Renderer({cards:[card]});
  assert.throws(
    () => renderer.render(mobiledoc),
    /Card "bad" must render dom/
  );
});

test('card may render nothing', (assert) => {
  let card = {
    name: 'ok',
    type: 'dom',
    render() {}
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [
      [card.name]
    ],
    markups: [],
    sections: [
      [CARD_SECTION_TYPE, 0]
    ]
  };

  renderer = new Renderer({cards:[card]});
  renderer.render(mobiledoc);

  assert.ok(true, 'No error thrown');
});

test('rendering nested mobiledocs in cards', (assert) => {
  let renderer;
  let cards = [{
    name: 'nested-card',
    type: 'dom',
    render({payload}) {
      let {result: rendered} = renderer.render(payload.mobiledoc);
      return rendered;
    }
  }];

  let innerMobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, [], 0, 'hello world']]
      ]
    ]
  };

  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [
      ['nested-card', {mobiledoc: innerMobiledoc}]
    ],
    markups: [],
    sections: [
      [CARD_SECTION_TYPE, 0]
    ]
  };

  renderer = new Renderer({cards});
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1, 'renders 1 section');
  let card = rendered.firstChild;
  assert.equal(childNodesLength(card), 1, 'card has 1 child');
  assert.equal(card.tagName, 'P', 'card has P child');
  assert.equal(card.innerText, 'hello world');
});

test('rendering unknown card without unknownCardHandler throws', (assert) => {
  let cardName = 'not-known';
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [
      [cardName]
    ],
    markups: [],
    sections: [
      [CARD_SECTION_TYPE, 0]
    ]
  };
  renderer = new Renderer({cards: [], unknownCardHandler: undefined});
  assert.throws(
    () => renderer.render(mobiledoc),
    new RegExp(`Card "${cardName}" not found.*no unknownCardHandler`)
  );
});

test('rendering unknown card uses unknownCardHandler', (assert) => {
  assert.expect(6);

  let cardName = 'my-card';
  let expectedOptions = {};
  let expectedPayload = {};

  let unknownCardHandler = ({env, options, payload}) => {
    assert.equal(env.name, cardName, 'name is correct');
    assert.ok(!env.isInEditor, 'not in editor');
    assert.ok(!!env.onTeardown, 'has onTeardown');
    assert.ok(!!env.didRender, 'has didRender');

    assert.deepEqual(options, expectedOptions, 'correct options');
    assert.deepEqual(payload, expectedPayload, 'correct payload');
  };

  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [
      [cardName, expectedPayload]
    ],
    markups: [],
    sections: [
      [CARD_SECTION_TYPE, 0]
    ]
  };
  renderer = new Renderer({
    cards: [], cardOptions: expectedOptions, unknownCardHandler
  });
  renderer.render(mobiledoc);
});

test('throws if given an object of cards', (assert) => {
  let cards = {};
  assert.throws(
    () => { new Renderer({cards}) }, // jshint ignore: line
    new RegExp('`cards` must be passed as an array')
  );
});

test('multiple spaces should preserve whitespace with nbsps', (assert) => {
  let space = ' ';
  let repeat = (str, count) => {
    let result = '';
    while (count--) {
      result += str;
    }
    return result;
  };
  let text = [
    repeat(space, 4), 'some',
    repeat(space, 5), 'text',
    repeat(space, 6)
  ].join('');
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, [], 0, text]]
      ]
    ]
  };

  let nbsp = '\u00A0';
  let sn = space + nbsp;
  let expectedText = [
    repeat(sn, 2), 'some',
    repeat(sn, 2), space, 'text',
    repeat(sn, 3)
  ].join('');
  let { result: rendered } = renderer.render(mobiledoc);
  let textNode = rendered.firstChild.firstChild;
  assert.equal(textNode.nodeValue, expectedText, 'renders the text');
});

test('throws when given unexpected mobiledoc version', (assert) => {
  let mobiledoc = {
    version: '0.1.0',
    atoms: [],
    cards: [],
    markups: [],
    sections: []
  };

  assert.throws(
    () => renderer.render(mobiledoc),
    /Unexpected Mobiledoc version.*0.1.0/
  );

  mobiledoc.version = '0.2.1';
  assert.throws(
    () => renderer.render(mobiledoc),
    /Unexpected Mobiledoc version.*0.2.1/
  );
});

test('XSS: unexpected markup and list section tag names are not renderered', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'script', [
        [MARKUP_MARKER_TYPE, [], 0, 'alert("markup section XSS")']
      ]],
      [LIST_SECTION_TYPE, 'script', [
        [[MARKUP_MARKER_TYPE, [], 0, 'alert("list section XSS")']]
      ]]
    ]
  };
  let { result } = renderer.render(mobiledoc);
  let content = outerHTML(result);
  assert.ok(content.indexOf('script') === -1, 'no script tag rendered');
});

test('XSS: unexpected markup types are not rendered', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [
      ['b'], // valid
      ['em'], // valid
      ['script'] // invalid
    ],
    sections: [
      [MARKUP_SECTION_TYPE, 'p', [
        [MARKUP_MARKER_TYPE, [0], 0, 'bold text'],
        [MARKUP_MARKER_TYPE, [1,2], 3, 'alert("markup XSS")'],
        [MARKUP_MARKER_TYPE, [], 0, 'plain text']
      ]]
    ]
  };
  let { result } = renderer.render(mobiledoc);
  let content = outerHTML(result);
  assert.ok(content.indexOf('script') === -1, 'no script tag rendered');
});

test('XSS: links with dangerous href values are not rendered', (assert) => {
  let unsafeHref = 'javascript:alert("link XSS")'; // jshint ignore:line
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [
      [
        'a', [
          'href',
          unsafeHref
        ]
      ]
    ],
    sections: [
      [MARKUP_SECTION_TYPE, 'p', [
        [MARKUP_MARKER_TYPE, [0], 1, 'link text'],
        [MARKUP_MARKER_TYPE, [], 0, 'plain text']
      ]]
    ]
  };
  let { result } = renderer.render(mobiledoc);
  let content = outerHTML(result);
  assert.equal(content, `<p><a href="unsafe:${escapeQuotes(unsafeHref)}">link text</a>plain text</p>`);
});

test('renders a mobiledoc with atom', (assert) => {
  assert.expect(8);
  let atomName = 'hello-atom';
  let expectedPayload = { name: 'bob' };
  let expectedOptions = { foo: 'bar' };
  let expectedValue = '@BOB';
  let expectedDom = window.document;

  let atom = {
    name: atomName,
    type: 'dom',
    render({ env, payload, value, options }) {
      assert.deepEqual(payload, expectedPayload, 'correct payload');
      assert.deepEqual(options, expectedOptions, 'correct options');
      assert.equal(value, expectedValue, 'correct value');
      assert.equal(env.name, atomName, 'correct name');
      assert.ok(!env.isInEditor, 'isInEditor correct');
      assert.ok(!!env.onTeardown, 'has onTeardown hook');
      assert.deepEqual(env.dom, expectedDom, 'env has dom');

      return document.createTextNode(`Hello ${value}`);
    }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [
      ['hello-atom', expectedValue, expectedPayload],
    ],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [ATOM_MARKER_TYPE, [], 0, 0]]
      ]
    ]
  };
  renderer = new Renderer({atoms: [atom], cardOptions: expectedOptions, dom: expectedDom});
  let { result: rendered } = renderer.render(mobiledoc);

  let sectionEl = rendered.firstChild;
  assert.equal(sectionEl.textContent, 'Hello ' + expectedValue);
});


test('throws when given atom with invalid type', (assert) => {
  let atom = {
    name: 'bad',
    type: 'other',
    render() {}
  };
  assert.throws(
    () => { new Renderer({atoms: [atom]}); }, // jshint ignore:line
    /Atom "bad" must be type "dom"/
  );
});

test('throws when given atom without `render`', (assert) => {
  let atom = {
    name: 'bad',
    type: 'dom',
    render: undefined
  };
  assert.throws(
    () => { new Renderer({atoms: [atom]}); }, // jshint ignore:line
    /Atom "bad" must define.*render/
  );
});

test('throws if atom render returns invalid result', (assert) => {
  let atom = {
    name: 'bad',
    type: 'dom',
    render() { return 'string'; }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [
      ['bad', 'Bob', { id: 42 }],
    ],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [ATOM_MARKER_TYPE, [], 0, 0]]
      ]
    ]
  };
  renderer = new Renderer({atoms: [atom]});
  assert.throws(
    () => renderer.render(mobiledoc),
    /Atom "bad" must render dom/
  );
});

test('atom may render nothing', (assert) => {
  let atom = {
    name: 'ok',
    type: 'dom',
    render() {}
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [
      ['ok', 'Bob', { id: 42 }],
    ],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [ATOM_MARKER_TYPE, [], 0, 0]]
      ]
    ]
  };

  renderer = new Renderer({atoms:[atom]});
  renderer.render(mobiledoc);

  assert.ok(true, 'No error thrown');
});

test('throws when rendering unknown atom without unknownAtomHandler', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [
      ['missing-atom', 'Bob', { id: 42 }],
    ],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [ATOM_MARKER_TYPE, [], 0, 0]]
      ]
    ]
  };
  renderer = new Renderer({atoms: [], unknownAtomHandler: undefined});
  assert.throws(
    () => renderer.render(mobiledoc),
    /Atom "missing-atom" not found.*no unknownAtomHandler/
  );
});

test('rendering unknown atom uses unknownAtomHandler', (assert) => {
  assert.expect(4);

  let atomName = 'missing-atom';
  let expectedPayload = { id: 42 };
  let cardOptions = {};
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [
      ['missing-atom', 'Bob', { id: 42 }],
    ],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [ATOM_MARKER_TYPE, [], 0, 0]]
      ]
    ]
  };
  let unknownAtomHandler = ({env, payload, options}) => {
    assert.equal(env.name, atomName, 'correct name');
    assert.ok(!!env.onTeardown, 'onTeardown hook exists');

    assert.deepEqual(payload, expectedPayload, 'correct payload');
    assert.deepEqual(options, cardOptions, 'correct options');
  };
  renderer = new Renderer({atoms: [], unknownAtomHandler, cardOptions});
  renderer.render(mobiledoc);
});

test('renders a mobiledoc with sectionElementRenderer', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [MARKUP_MARKER_TYPE, [], 0, 'hello world']]
      ],
      [MARKUP_SECTION_TYPE, 'p', [
        [MARKUP_MARKER_TYPE, [], 0, 'hello world']]
      ],
      [MARKUP_SECTION_TYPE, 'h1', [
        [MARKUP_MARKER_TYPE, [], 0, 'hello world']]
      ]
    ]
  };
  renderer = new Renderer({
    sectionElementRenderer: {
      p: () => document.createElement('pre'),
      H1: (tagName, dom) => dom.createElement('h2')
    }
  });
  let renderResult = renderer.render(mobiledoc);
  let { result: rendered } = renderResult;
  assert.equal(childNodesLength(rendered), 3,
               'renders three sections');
  assert.equal(rendered.firstChild.tagName, 'PRE',
               'renders a pre');
  assert.equal(rendered.firstChild.textContent, 'hello world',
               'renders the text');
  assert.equal(rendered.childNodes.item(1).tagName, 'PRE',
               'renders a pre');
  assert.equal(rendered.childNodes.item(2).tagName, 'H2',
               'renders an h2');
});

test('renders a mobiledoc with markupElementRenderer', (assert) => {
  let mobiledoc = {
    "version": MOBILEDOC_VERSION_0_3_0,
    "atoms": [],
    "cards": [],
    "markups": [
      ["a", [ "href", "#foo" ]]
    ],
    "sections": [
      [MARKUP_SECTION_TYPE, "p", [
        [MARKUP_MARKER_TYPE, [], 0, "Lorem ipsum "],
        [MARKUP_MARKER_TYPE, [0], 1, "dolor"],
        [MARKUP_MARKER_TYPE, [], 0, " sit amet."]]
      ]
    ]
  };
  renderer = new Renderer({
    markupElementRenderer: {
      A: (tagName, dom, attrs) => {
        let element = dom.createElement('span');
        element.setAttribute('data-tag', tagName);
        element.setAttribute('data-href', attrs.href);
        return element;
      }
    }
  });
  let renderResult = renderer.render(mobiledoc);
  let { result: rendered } = renderResult;

  assert.equal(rendered.firstChild.childNodes[1].textContent, 'dolor',
               'renders text inside of marker');
  assert.equal(rendered.firstChild.childNodes[1].tagName, 'SPAN',
               'transforms markup nodes');
  assert.propEqual(rendered.firstChild.childNodes[1].dataset, {tag: "a", href: "#foo"},
                   'passes original tag and attributes to transform');
  assert.equal(rendered.firstChild.childNodes[0].textContent, 'Lorem ipsum ',
               'renders plain text nodes');
  assert.equal(rendered.firstChild.childNodes[2].nodeType, 3,
               'renders text nodes as proper type');
});

test('unexpected markup types are not handled by markup renderer', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [
      ['script']
    ],
    sections: [
      [MARKUP_SECTION_TYPE, 'p', [
        [MARKUP_MARKER_TYPE, [0], 1, 'alert("markup XSS")']
      ]]
    ]
  };
  renderer = new Renderer({
    markupElementRenderer: {
      SCRIPT: (markerType, dom) => {
        return dom.createElement('script');
      }
    }
  });
  let { result } = renderer.render(mobiledoc);
  let content = outerHTML(result);
  assert.ok(content.indexOf('script') === -1, 'no script tag rendered');
});
}

module('Unit: Mobiledoc DOM Renderer - 0.3', {
  beforeEach() {
    renderer = new Renderer();
  }
});

generateTests();

test('teardown removes rendered sections from dom', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'p', [
        [MARKUP_MARKER_TYPE, [], 0, 'Hello world']
      ]]
    ]
  };

  let { result: rendered, teardown } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1, 'renders 1 section');

  let fixture = document.getElementById('qunit-fixture');
  fixture.appendChild(rendered);

  assert.ok(childNodesLength(fixture) === 1, 'precond - result is appended');

  teardown();

  assert.ok(childNodesLength(fixture) === 0, 'rendered result removed after teardown');
});

test('teardown hook calls registered teardown methods', (assert) => {
  let cardName = 'title-card';
  let didTeardown = false;

  let card = {
    name: cardName,
    type: 'dom',
    render({env}) {
      env.onTeardown(() => didTeardown = true);
    }
  };

  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [
      [cardName]
    ],
    markups: [],
    sections: [
      [CARD_SECTION_TYPE, 0]
    ]
  };

  renderer = new Renderer({cards: [card]});
  let { teardown } = renderer.render(mobiledoc);

  assert.ok(!didTeardown, 'teardown not called');

  teardown();

  assert.ok(didTeardown, 'teardown called');
});

test('render hook calls registered didRender callbacks', (assert) => {
  let cardName = 'title-card';
  let didRender = false;

  let card = {
    name: cardName,
    type: 'dom',
    render({env}) {
      env.didRender(() => didRender = true);
    }
  };

  let mobiledoc = {
    version: MOBILEDOC_VERSION_0_3_0,
    atoms: [],
    cards: [
      [cardName]
    ],
    markups: [],
    sections: [
      [CARD_SECTION_TYPE, 0]
    ]
  };

  renderer = new Renderer({cards: [card]});

  assert.ok(!didRender, 'didRender not called');

  renderer.render(mobiledoc);

  assert.ok(!!didRender, 'didRender called');
});

module('Unit: Mobiledoc DOM Renderer w/ SimpleDOM - 0.3', {
  beforeEach() {
    renderer = new Renderer({ dom: new SimpleDOM.Document() });
  }
});

generateTests();

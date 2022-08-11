/* global QUnit, SimpleDOM */

import Renderer from 'mobiledoc-dom-renderer';
import { RENDER_TYPE } from 'mobiledoc-dom-renderer';
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

const { test, module } = QUnit;
const MOBILEDOC_VERSION = '0.2.0';
const dataUri = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=";

let renderer;

// Add tests that should run with both simple-dom and
// the window.document in this function.
function generateTests() {

test('renders an empty mobiledoc', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      []  // sections
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);

  assert.ok(!!rendered, 'renders result');
  assert.ok(!rendered.firstChild, 'has no sections');
});

test('renders a mobiledoc without markups', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [   // sections
        [MARKUP_SECTION_TYPE, 'P', [
          [[], 0, 'hello world']]
        ]
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

test('renders markup section "pull-quote" as div with class', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [   // sections
        [MARKUP_SECTION_TYPE, 'pull-quote', [
          [[], 0, 'hello world']]
        ]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.firstChild;

  assert.equal(outerHTML(sectionEl), '<div class="pull-quote">hello world</div>');
});


test('renders a mobiledoc with simple (no attributes) markup', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [        // markers
        ['B'],
      ],
      [        // sections
        [MARKUP_SECTION_TYPE, 'P', [
          [[0], 1, 'hello world']]
        ]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.firstChild;

  assert.equal(sectionEl.firstChild.tagName, 'B');
  assert.equal(sectionEl.firstChild.firstChild.nodeValue, 'hello world');
});

test('renders a mobiledoc with complex (has attributes) markup', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [        // markers
        ['A', ['href', 'http://google.com']],
      ],
      [        // sections
        [MARKUP_SECTION_TYPE, 'P', [
            [[0], 1, 'hello world']
        ]]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.firstChild;

  assert.equal(innerHTML(sectionEl), '<a href="http://google.com">hello world</a>');
  assert.equal(innerHTML(sectionEl), '<a href="http://google.com">hello world</a>');
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
        [MARKUP_SECTION_TYPE, 'P', [
          [[0], 0, 'hello '], // b
          [[1], 0, 'brave '], // b+i
          [[], 1, 'new '], // close i
          [[], 1, 'world'] // close b
        ]]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.childNodes.item(0);

  assert.equal(innerHTML(sectionEl), '<b>hello <i>brave new </i>world</b>');
});

test('renders a mobiledoc with image section', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [IMAGE_SECTION_TYPE, dataUri]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.childNodes.item(0);

  assert.equal(sectionEl.src, dataUri);
});

test('renders a mobiledoc with built-in image card', (assert) => {
  assert.expect(3);
  let cardName = 'image';
  let payload = {
    src: dataUri
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [CARD_SECTION_TYPE, cardName, payload]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc);
  assert.equal(childNodesLength(rendered), 1,
               'renders 1 section');
  let sectionEl = rendered.childNodes.item(0);

  assert.equal(sectionEl.tagName, 'IMG');
  assert.equal(sectionEl.src, dataUri);
});

test('render mobiledoc with list section and list items', (assert) => {
  const mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [LIST_SECTION_TYPE, 'ul', [
          [[[], 0, 'first item']],
          [[[], 0, 'second item']],
        ]]
      ]
    ]
  };
  let { result: rendered } = renderer.render(mobiledoc, document.createElement('div'));
  assert.equal(childNodesLength(rendered), 1, 'renders 1 section');

  const section = rendered.firstChild;
  assert.equal(section.tagName, 'UL');

  assert.equal(childNodesLength(section), 2, '2 list items');

  assert.equal(section.firstChild.tagName, 'LI', 'correct tagName for item 1');
  assert.equal(section.firstChild.firstChild.nodeValue, 'first item',
               'correct text node for item 1');

  assert.equal(section.lastChild.tagName, 'LI', 'correct tagName for item 2');
  assert.equal(section.lastChild.firstChild.nodeValue, 'second item',
               'correct text node for item 2');
});

test('renders a mobiledoc with card section', (assert) => {
  assert.expect(8);
  let cardName = 'title-card';
  let expectedPayload = { name: 'bob' };
  let expectedOptions = {foo: 'bar'};
  let TitleCard = {
    name: cardName,
    type: 'dom',
    render({env, options, payload}) {
      let {name, isInEditor, onTeardown, didRender} = env;
      assert.equal(name, cardName, 'has name');
      assert.ok(!isInEditor, 'not isInEditor');
      assert.ok(!!onTeardown, 'has onTeardown');
      assert.ok(!!didRender, 'has didRender');

      assert.deepEqual(options, expectedOptions);
      assert.deepEqual(payload, expectedPayload);

      return document.createTextNode(payload.name);
    }
  };
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],      // markers
      [        // sections
        [CARD_SECTION_TYPE, cardName, expectedPayload]
      ]
    ]
  };
  renderer = new Renderer({cards: [TitleCard], cardOptions: expectedOptions});
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
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [CARD_SECTION_TYPE, card.name]
      ]
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
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [CARD_SECTION_TYPE, card.name]
      ]
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
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [   // sections
        [MARKUP_SECTION_TYPE, 'P', [
          [[], 0, 'hello world']]
        ]
      ]
    ]
  };

  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [   // sections
        [CARD_SECTION_TYPE, 'nested-card', {mobiledoc: innerMobiledoc}]
      ]
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
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [CARD_SECTION_TYPE, cardName]
      ]
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
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [CARD_SECTION_TYPE, cardName, expectedPayload]
      ]
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
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [   // sections
        [MARKUP_SECTION_TYPE, 'P', [
          [[], 0, text]]
        ]
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

test('replaces tab characters with EM SPACE', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [   // sections
        [MARKUP_SECTION_TYPE, 'P', [
          [[], 0, "\tHello	world"]]
        ]
      ]
    ]
  };

  let { result: rendered } = renderer.render(mobiledoc);
  let elementNode = rendered.firstChild.firstChild;
  assert.equal(elementNode.nodeValue, '\u2003Hello\u2003world', 'replaces tabs with &emsp;');
});

test('throws when given unexpected mobiledoc version', (assert) => {
  let mobiledoc = {
    version: '0.1.0',
    sections: [
      [], []
    ]
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
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [MARKUP_SECTION_TYPE, 'script', [
          [[], 0, 'alert("markup section XSS")']
        ]],
        [LIST_SECTION_TYPE, 'script', [
          [[[], 0, 'alert("list section XSS")']]
        ]]
      ]
    ]
  };
  let { result } = renderer.render(mobiledoc);
  let content = outerHTML(result);
  assert.ok(content.indexOf('script') === -1, 'no script tag rendered');
});

test('XSS: unexpected markup types are not rendered', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [
        ['b'], // valid
        ['em'], // valid
        ['script'] // invalid
      ],
      [
        [MARKUP_SECTION_TYPE, 'p', [
          [[0], 0, 'bold text'],
          [[1,2], 3, 'alert("markup XSS")'],
          [[], 0, 'plain text']
        ]]
      ]
    ]
  };
  let { result } = renderer.render(mobiledoc);
  let content = outerHTML(result);
  assert.ok(content.indexOf('script') === -1, 'no script tag rendered');
});

test('XSS: links with dangerous href values are not rendered', (assert) => {
  let unsafeHref = 'javascript:alert("link XSS")'; // jshint ignore:line
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [
        ["a", [ "href", unsafeHref ]]
      ],
      [
        [MARKUP_SECTION_TYPE, "p", [
          [[0], 1, "link text"],
          [[], 0, "plain text"]]
        ]
      ]
    ]
  };
  let { result } = renderer.render(mobiledoc);
  let content = outerHTML(result);
  assert.equal(content, `<p><a href="unsafe:${escapeQuotes(unsafeHref)}">link text</a>plain text</p>`);
});

test('renders a mobiledoc with sectionElementRenderer', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [], // markers
      [   // sections
      [MARKUP_SECTION_TYPE, 'P', [
        [[], 0, 'hello world']]
      ],
      [MARKUP_SECTION_TYPE, 'p', [
        [[], 0, 'hello world']]
      ],
      [MARKUP_SECTION_TYPE, 'h1', [
        [[], 0, 'hello world']]
      ]
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
  assert.equal(rendered.lastChild.tagName, 'H2',
               'renders an h2');
});

test('renders a mobiledoc with markupElementRenderer', (assert) => {
  let mobiledoc = {
    "version": MOBILEDOC_VERSION,
    "sections": [
      [
        ["A", [ "href", "#foo" ]]
      ],
      [
        [MARKUP_SECTION_TYPE, "p", [
          [[], 0, "Lorem ipsum "],
          [[0], 1, "dolor"],
          [[], 0, " sit amet."]]
        ]
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

test('unexpected markup types are not passed to markup renderer', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [
        ['script'] // invalid
      ],
      [
        [MARKUP_SECTION_TYPE, 'p', [
          [[0], 1, 'alert("markup XSS")']
        ]]
      ]
    ]
  };
  renderer = new Renderer({
    markupElementRenderer: {
      SCRIPT: (tagName, dom) => {
        return dom.createElement('script');
      }
    }
  });
  let { result } = renderer.render(mobiledoc);
  let content = outerHTML(result);
  assert.ok(content.indexOf('script') === -1, 'no script tag rendered');
});
}

module('Unit: Mobiledoc DOM Renderer - 0.2', {
  beforeEach() {
    renderer = new Renderer();
  }
});

generateTests();

test('teardown removes rendered sections from dom', (assert) => {
  let mobiledoc = {
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [MARKUP_SECTION_TYPE, 'p', [
          [[], 0, 'Hello world']
        ]]
      ]
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
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [CARD_SECTION_TYPE, cardName]
      ]
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
    version: MOBILEDOC_VERSION,
    sections: [
      [],
      [
        [CARD_SECTION_TYPE, cardName]
      ]
    ]
  };

  renderer = new Renderer({cards: [card]});

  assert.ok(!didRender, 'didRender not called');

  renderer.render(mobiledoc);

  assert.ok(didRender, 'didRender called');
});


module('Unit: Mobiledoc DOM Renderer w/ SimpleDOM - 0.2', {
  beforeEach() {
    renderer = new Renderer({ dom: new SimpleDOM.Document() });
  }
});

generateTests();

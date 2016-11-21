/* global QUnit */

import {
  isSafeMarker
} from 'mobiledoc-dom-renderer/utils/sanitization-utils';

const { test, module } = QUnit;

module('Unit: Mobiledoc DOM Renderer - Sanitization utils');

test('#isSafeMarker - a', (assert) => {
  // No HREF
  assert.ok(isSafeMarker('a', []), "Link without href attribute is safe");
  assert.ok(isSafeMarker('a', null), "Also safe if the attrs array is 'null'");

  let unsafe = [
    'javascript:alert("XSS")', // jshint ignore: line
    'vbscript:alert("XSS")' // jshint ignore: line
  ];

  for (let i = 0; i < unsafe.length; i++) {
    let uri = unsafe[i];
    assert.ok(! isSafeMarker('a', ['href', uri]), `${uri} should be unsafe`);
  }

  let safe = [
    'http://www.google.com',
    'https://www.google.com',
    'ftp://google.com',
    'http://www.google.com/with-path',
    'www.google.com',
    'tel:12345',
    'mailto:john@doe.com'
  ];

  for (let i = 0; i < safe.length; i++) {
    let uri = safe[i];
    assert.ok(isSafeMarker('a', ['href', uri]), `${uri} should be safe`);
  }
});

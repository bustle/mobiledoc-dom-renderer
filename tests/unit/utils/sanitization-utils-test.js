/* global QUnit */

import { isUnsafeUri } from 'mobildoc-dom-renderer/utils/sanitization-utils';

const { test, module } = QUnit;

module('Unit: Mobiledoc DOM Renderer - Sanitization utils');

test('#isUnsafeUri', (assert) => {
  let unsafe = [
    'javascript:alert("XSS")', // jshint ignore: line
    'vbscript:alert("XSS")' // jshint ignore: line
  ];

  for (let i = 0; i < unsafe.length; i++) {
    let uri = unsafe[i];
    assert.ok(isUnsafeUri(uri), `${uri} is unsafe`);
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
    assert.ok(! isUnsafeUri(uri), `${uri} is safe`);
  }
});

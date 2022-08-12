/* global QUnit */

import {
  sanitizeHref
} from 'mobiledoc-dom-renderer/utils/sanitization-utils';

const { test, module } = QUnit;

module('Unit: Mobiledoc DOM Renderer - Sanitization utils');

test('#sanitizeHref', (assert) => {
  let unsafe = [
    'javascript:alert("XSS")', // jshint ignore: line
    'jaVasCript:alert("XSS")', // jshint ignore: line
    'javascript:javascript:alert("XSS")', // jshint ignore: line
    'java script:alert("XSS")', // jshint ignore: line
    'ja vas cri pt::alert("XSS")', // jshint ignore: line
    'vbscript:alert("XSS")' // jshint ignore: line
  ];

  for (let i = 0; i < unsafe.length; i++) {
    let url = unsafe[i];
    assert.equal(sanitizeHref(url), `unsafe:${url}`);
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
    let url = safe[i];
    assert.equal(sanitizeHref(url), url);
  }
});

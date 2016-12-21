/* global QUnit */

import {
  sanitizeAttributeValue,
  reduceAndSanitizeAttributes
} from 'mobiledoc-dom-renderer/utils/sanitization-utils';

const { test, module } = QUnit;

module('Unit: Mobiledoc DOM Renderer - Sanitization utils');

test('#sanitizeAttributeValue - a', (assert) => {
  let unsafe = [
    'javascript:alert("XSS")', // jshint ignore: line
    'vbscript:alert("XSS")' // jshint ignore: line
  ];

  for (let i = 0; i < unsafe.length; i++) {
    let url = unsafe[i];
    assert.equal(sanitizeAttributeValue('href', url, 'a'), `unsafe:${url}`);
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
    assert.equal(sanitizeAttributeValue('href', url, 'a'), url);
  }
});

test('#reduceAndSanitizeAttributes - a', (assert) => {
  let unsafe = [
    'javascript:alert("XSS")', // jshint ignore: line
    'vbscript:alert("XSS")' // jshint ignore: line
  ];

  for (let i = 0; i < unsafe.length; i++) {
    let url = unsafe[i];
    assert.deepEqual(reduceAndSanitizeAttributes(['href', url], 'a'), {
      'href': `unsafe:${url}`
    });
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
    assert.deepEqual(reduceAndSanitizeAttributes(['href', url], 'a'), {
      'href': url
    });
  }
});

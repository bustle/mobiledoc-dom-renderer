/* globals module */

import { includes } from './array-utils';
import {
  isNode,
  hasDOM
} from './dom';

const badProtocols = [
  'javascript:', // jshint ignore:line
  'vbscript:' // jshint ignore:line
];

function getProtocol(url) {
  if (hasDOM) {
    /* Presume we are in a browser */
    let a = document.createElement('a');
    a.href = url;
    return a.protocol;
  } else if (isNode) {
    /* In node */
    let nodeURL = module.require('url');
    let protocol = null;
    if (typeof url === 'string') {
      protocol = nodeURL.parse(url).protocol;
    }
    return (protocol === null) ? ':' : protocol;
  } else {
    throw new Error('Mobiledoc DOM Renderer is unable to sanitize href tags in this environment');
  }
}

export function sanitizeHref(url) {
  let protocol = getProtocol(url);
  if (includes(badProtocols, protocol)) {
    return `unsafe:${url}`;
  }
  return url;
}

/**
 * @param attributes array
 * @return obj with normalized attribute names (lowercased)
 */
export function reduceAttributes(attributes) {
  let obj = {};
  for (let i = 0; i < attributes.length; i += 2) {
    let key = attributes[i];
    let val = attributes[i+1];
    obj[key.toLowerCase()] = val;
  }
  return obj;
}

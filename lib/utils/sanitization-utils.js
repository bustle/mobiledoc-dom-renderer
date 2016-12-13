/* globals module */

const badProtocols = [
  'javascript:', // jshint ignore:line
  'vbscript:' // jshint ignore:line
];

const isNode = !window && (typeof module === 'object' && typeof module.require === 'function');
const hasDOM = typeof document === 'object';

function includes(array, detectValue) {
  for (let i=0;i < array.length;i++) {
    let value = array[i];
    if (value === detectValue) {
      return true;
    }
  }
  return false;
}

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

function sanitizeHref(url) {
  let protocol = getProtocol(url);
  if (includes(badProtocols, protocol)) {
    return `unsafe:${url}`;
  }
  return url;
}

export function sanitizeAttributeValue(attributeName, attributeValue, tagName) {
  if (tagName === 'a' && attributeName === 'href') {
    return sanitizeHref(attributeValue);
  }
  return attributeValue;
}

export function reduceAndSanitizeAttributes(attributes, tagName) {
  let attrsObj = {};
  for (let i=0,l=attributes.length; i<l; i=i+2) {
    let propName = attributes[i],
        propValue = attributes[i+1];
    attrsObj[propName] = sanitizeAttributeValue(propName, propValue, tagName);
  }
  return attrsObj;
}


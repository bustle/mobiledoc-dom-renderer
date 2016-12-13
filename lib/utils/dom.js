/* globals module */

function addHTMLSpaces(text) {
  let nbsp = '\u00A0';
  return text.replace(/  /g, ' ' + nbsp);
}

export function createTextNode(dom, text) {
  return dom.createTextNode(addHTMLSpaces(text));
}

export function normalizeTagName(tagName) {
  return tagName.toLowerCase();
}

export const isNode = !window && (typeof module === 'object' && typeof module.require === 'function');
export const hasDOM = typeof document === 'object';

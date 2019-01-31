import {
  isMarkupSectionElementName
} from '../utils/tag-names';
import {
  sanitizeHref
} from './sanitization-utils';

export const VALID_ATTRIBUTES = [
  'data-md-text-align'
]

export class MobiledocError extends Error {};

function _isValidAttribute(attr) {
  return VALID_ATTRIBUTES.indexOf(attr) !== -1;
}

export function assert(message, conditional) {
  if (!conditional) {
    throw new MobiledocError(message);
  }
}

function handleMarkupSectionAttribute(element, attributeKey, attributeValue) {
  assert(`cannot use attribute: ${attributeKey}`, _isValidAttribute(attributeKey));

  element.style.setProperty(attributeKey.replace('data-md-',''), attributeValue);
}

export function defaultSectionElementRenderer(tagName, dom, attrsObj) {
  let element;
  if (isMarkupSectionElementName(tagName)) {
    element = dom.createElement(tagName);

    Object.keys(attrsObj).forEach(k => {
      handleMarkupSectionAttribute(element, k, attrsObj[k]);
    });
  } else {
    element = dom.createElement('div');
    element.setAttribute('class', tagName);
  }

  return element;
}

function sanitizeAttribute(tagName, attrName, attrValue) {
  if (tagName === 'a' && attrName === 'href') {
    return sanitizeHref(attrValue);
  } else {
    return attrValue;
  }
}

export function defaultMarkupElementRenderer(tagName, dom, attrsObj) {
  let element = dom.createElement(tagName);
  Object.keys(attrsObj).forEach(attrName => {
    let attrValue = attrsObj[attrName];
    attrValue = sanitizeAttribute(tagName, attrName, attrValue);
    element.setAttribute(attrName, attrValue);
  });
  return element;
}


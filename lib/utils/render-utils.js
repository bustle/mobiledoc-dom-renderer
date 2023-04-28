import {
  isMarkupSectionElementName
} from '../utils/tag-names';
import {
  sanitizeHref
} from './sanitization-utils';

function _isValidAttribute(attr) {
  return typeof attr === 'string' && attr.match(/^data-([0-9a-zA-Z-])+$/);
}

function handleMarkupSectionAttribute(element, attributeKey, attributeValue) {
  if (!_isValidAttribute(attributeKey)) {
    throw new Error(`Cannot use attribute: ${attributeKey}`);
  }

  element.setAttribute(attributeKey, attributeValue);
}

export function defaultSectionElementRenderer(tagName, dom, attrsObj = {}) {
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


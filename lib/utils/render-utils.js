import {
  isMarkupSectionElementName
} from '../utils/tag-names';
import {
  sanitizeHref
} from './sanitization-utils';

export function defaultSectionElementRenderer(tagName, dom) {
  let element;
  if (isMarkupSectionElementName(tagName)) {
    element = dom.createElement(tagName);
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


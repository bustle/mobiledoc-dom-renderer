import {
  isMarkupSectionElementName
} from '../utils/tag-names';
import {
  sanitizeHref
} from './sanitization-utils';

function defaultMarkupSanitizer({tagName, attributeName, attributeValue}) {
  if (tagName === 'a' && attributeName === 'href') {
    return sanitizeHref(attributeValue);
  } else {
    return attributeValue;
  }
}

/*
 * return a sanitizer function that first uses the passed sanitizer
 * (if present), and then uses the default sanitizer if that didn't return
 * a string
 */
export function createMarkupSanitizerWithFallback(sanitizer) {
  if (sanitizer) {
    return (...args) => sanitizer(...args) || defaultMarkupSanitizer(...args);
  } else {
    return defaultMarkupSanitizer;
  }
}

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

export function defaultMarkupElementRenderer(tagName, dom, attrsObj) {
  let element = dom.createElement(tagName);
  Object.keys(attrsObj).forEach(key => {
    element.setAttribute(key, attrsObj[key]);
  });
  return element;
}


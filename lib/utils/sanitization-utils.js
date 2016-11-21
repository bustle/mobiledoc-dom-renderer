import kvReduce from '../utils/kv-reduce';

const UNSAFE_URI_REGEX = /^(javascript:|vbscript:)/;

function isUnsafeUri(s) {
  return UNSAFE_URI_REGEX.test(s);
}

export function isSafeMarker(tagName, attrs) {
  if (tagName === 'a') {
    let attrObj = attrs.reduce(kvReduce, {});

    let href = attrObj.href;
    if (href.length > 0 && isUnsafeUri(href)) {
      return false;
    }
  }

  return true;
}

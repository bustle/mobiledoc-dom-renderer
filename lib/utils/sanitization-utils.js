const UNSAFE_URI_REGEX = /^(javascript:|vbscript:)/;

export function isUnsafeUri(s) {
  return UNSAFE_URI_REGEX.test(s);
}

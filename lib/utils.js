export function createElement(tagName) {
  return document.createElement(tagName);
}

export function appendChild(target, child) {
  target.appendChild(child);
}

export function createTextNode(text) {
  return document.createTextNode(text);
}

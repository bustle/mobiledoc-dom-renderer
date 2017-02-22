/* global SimpleDOM */

export function childNodesLength(element) {
  let length = 0;
  let node = element.firstChild;
  while (node) {
    length++;
    node = node.nextSibling;
  }
  return length;
}

export function outerHTML(node) {
  if (node.outerHTML) {
    return node.outerHTML;
  } else {
    let serializer = new SimpleDOM.HTMLSerializer([]);
    return serializer.serialize(node);
  }
}

export function innerHTML(parentNode) {
  let content = [];
  let node = parentNode.firstChild;
  while (node) {
    content.push(outerHTML(node));
    node = node.nextSibling;
  }
  return content.join('');
}

export function escapeQuotes(string) {
  return string.replace(/"/g, '&quot;');
}

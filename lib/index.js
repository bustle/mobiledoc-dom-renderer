import DOMRenderer from './dom-renderer';

export function registerGlobal(window) {
  window.MobiledocDOMRenderer = DOMRenderer;
}

export default DOMRenderer;

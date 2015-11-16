import Renderer from './renderer';

export function registerGlobal(window) {
  window.MobiledocDOMRenderer = Renderer;
}

export default Renderer;

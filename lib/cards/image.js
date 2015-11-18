import { createElement } from '../utils/dom';
import RENDER_TYPE from '../utils/render-type';

export default {
  name: 'image',
  type: RENDER_TYPE,
  render({payload}) {
    let img = createElement('img');
    img.src = payload.src;
    return img;
  }
};

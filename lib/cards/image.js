import {
  createElement,
  appendChild
} from '../utils/dom';

const ImageCard = {
  name: 'image',
  display: {
    setup(element, options, env, payload) {
      if (payload.src) {
        let img = createElement('img');
        img.src = payload.src;
        appendChild(element, img);
      }
    }
  }
};

export default ImageCard;

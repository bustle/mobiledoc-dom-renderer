import {
  createElement
} from "../utils";

const ImageCard = {
  name: 'image',
  display: {
    setup(element, options, env, payload) {
      if (payload.src) {
        let img = createElement('img');
        img.src = payload.src;
        element.appendChild(img);
      }
    }
  }
};

export default ImageCard;

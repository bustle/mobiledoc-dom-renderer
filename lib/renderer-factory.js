import Renderer from './renderer';
import RENDER_TYPE from './utils/render-type';

/**
 * runtime DOM renderer
 * renders a mobiledoc to DOM
 *
 * input: mobiledoc
 * output: DOM
 */

function validateCards(cards) {
  if (!Array.isArray(cards)) {
    throw new Error('`cards` must be passed as an array, not an object.');
  }

  for (let i=0; i < cards.length; i++) {
    let card = cards[i];
    if (card.type !== RENDER_TYPE) {
      throw new Error(`Card "${card.name}" must be of type "${RENDER_TYPE}", is type "${card.type}"`);
    }
    if (!card.render) {
      throw new Error(`Card "${card.name}" must define \`render\``);
    }
  }
}

export default class RendererFactory {
  constructor({cards, atoms, cardOptions, unknownCardHandler}={}) {
    cards = cards || [];
    validateCards(cards);
    atoms = atoms || [];
    cardOptions = cardOptions || {};

    this.state = { cards, atoms, cardOptions, unknownCardHandler };
  }

  render(mobiledoc) {
    return new Renderer(mobiledoc, this.state).render();
  }
}

import {
  createElement,
  appendChild,
  createTextNode
} from "./utils";
import ImageCard from "./cards/image";

/**
 * runtime DOM renderer
 * renders a mobiledoc to DOM
 *
 * input: mobiledoc
 * output: DOM
 */

function createElementFromMarkerType([tagName, attributes]=['', []]){
  let element = createElement(tagName);
  attributes = attributes || [];

  for (let i=0,l=attributes.length; i<l; i=i+2) {
    let propName = attributes[i],
        propValue = attributes[i+1];
    element.setAttribute(propName, propValue);
  }
  return element;
}

function setDefaultCards(cards) {
  cards.image = cards.image || ImageCard;
}

export default class DOMRenderer {
  /**
   * @param {Mobiledoc} mobiledoc
   * @param {DOMNode} [rootElement] defaults to an empty div
   * @param {Object} [cards] Each top-level property on the object is considered
   *        to be a card's name, its value is an object with `setup` and (optional) `teardown`
   *        properties
   * @return DOMNode
   */
  render({version, sections: sectionData}, rootElement=createElement('div'), cards={}) {
    const [markerTypes, sections] = sectionData;
    this.root = rootElement;
    this.markerTypes = markerTypes;

    if (Array.isArray(cards)) {
      throw new Error('`cards` must be passed as an object, not an array.');
    }

    this.cards = cards;
    setDefaultCards(this.cards);

    sections.forEach((section) => this.renderSection(section));

    return this.root;
  }

  renderSection(section) {
    const [type] = section;
    let rendered;
    switch (type) {
      case 1: // markup section
        rendered = this.renderMarkupSection(section);
        appendChild(this.root, rendered);
        break;
      case 2:
        rendered = this.renderImageSection(section);
        appendChild(this.root, rendered);
        break;
      case 3: // list section
        rendered = this.renderListSection(section);
        appendChild(this.root, rendered);
        break;
      case 10: // card section
        rendered = this.renderCardSection(section);
        appendChild(this.root, rendered);
        break;
      default:
        throw new Error('Unimplement renderer for type ' + type);
    }
  }

  renderListSection([type, tagName, listItems]) {
    const element = createElement(tagName);
    listItems.forEach(li => {
      element.appendChild(this.renderListItem(li));
    });
    return element;
  }

  renderListItem(markers) {
    const element = createElement('li');
    this._renderMarkersOnElement(element, markers);
    return element;
  }

  renderImageSection([type, src]) {
    let element = createElement('img');
    element.src = src;
    return element;
  }

  renderCardSection([type, name, payload]) {
    let card = this.cards[name];
    if (!card) {
      throw new Error(`Cannot render unknown card named ${name}`);
    }
    if (!payload) {
      payload = {};
    }
    let element = createElement('div');
    card.display.setup(element, {}, {name}, payload);
    return element;
  }

  renderMarkupSection([type, tagName, markers]) {
    const element = createElement(tagName);
    this._renderMarkersOnElement(element, markers);
    return element;
  }

  _renderMarkersOnElement(element, markers) {
    let elements = [element];
    let currentElement = element;

    for (let i=0, l=markers.length; i<l; i++) {
      let marker = markers[i];
      let [openTypes, closeTypes, text] = marker;

      for (let j=0, m=openTypes.length; j<m; j++) {
        let markerType = this.markerTypes[openTypes[j]];
        let openedElement = createElementFromMarkerType(markerType);
        appendChild(currentElement, openedElement);
        elements.push(openedElement);
        currentElement = openedElement;
      }

      appendChild(currentElement, createTextNode(text));

      for (let j=0, m=closeTypes; j<m; j++) {
        elements.pop();
        currentElement = elements[elements.length - 1];
      }
    }
  }
}

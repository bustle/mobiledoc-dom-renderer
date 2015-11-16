import {
  createElement,
  appendChild,
  createTextNode,
  setAttribute
} from './utils/dom';
import ImageCard from './cards/image';

const MARKUP_SECTION_TYPE = 1;
const IMAGE_SECTION_TYPE = 2;
const LIST_SECTION_TYPE = 3;
const CARD_SECTION_TYPE = 10;

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
    setAttribute(element, propName, propValue);
  }
  return element;
}

function renderMarkersOnElement(element, markers, renderState) {
  let elements = [element];
  let currentElement = element;

  for (let i=0, l=markers.length; i<l; i++) {
    let marker = markers[i];
    let [openTypes, closeTypes, text] = marker;

    for (let j=0, m=openTypes.length; j<m; j++) {
      let markerType = renderState.markerTypes[openTypes[j]];
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

function renderListItem(markers, renderState) {
  const element = createElement('li');
  renderMarkersOnElement(element, markers, renderState);
  return element;
}

function renderListSection([type, tagName, listItems], renderState) {
  const element = createElement(tagName);
  listItems.forEach(li => {
    appendChild(element, (renderListItem(li, renderState)));
  });
  return element;
}

function renderImageSection([type, src]) {
  let element = createElement('img');
  element.src = src;
  return element;
}

function renderCardSection([type, name, payload], renderState) {
  let { cards } = renderState;
  let card = cards[name];
  if (!card) {
    throw new Error(`Cannot render unknown card named ${name}`);
  }
  if (!payload) {
    payload = {};
  }
  let element = createElement('div');
  let cardOptions = renderState.options.cardOptions || {};
  card.display.setup(element, cardOptions, {name}, payload);
  return element;
}

function renderMarkupSection([type, tagName, markers], renderState) {
  const element = createElement(tagName);
  renderMarkersOnElement(element, markers, renderState);
  return element;
}

function renderSection(section, renderState) {
  const [type] = section;
  switch (type) {
    case MARKUP_SECTION_TYPE:
      return renderMarkupSection(section, renderState);
    case IMAGE_SECTION_TYPE:
      return renderImageSection(section, renderState);
    case LIST_SECTION_TYPE:
      return renderListSection(section, renderState);
    case CARD_SECTION_TYPE:
      return renderCardSection(section, renderState);
    default:
      throw new Error('Unimplement renderer for type ' + type);
  }
}

function validateVersion(version) {
  if (version !== '0.2.0') {
    throw new Error(`Unexpected Mobiledoc version "${version}"`);
  }
}

export default class Renderer {
  /**
   * @param {Mobiledoc} mobiledoc
   * @param {DOMNode} [rootElement] defaults to an empty div
   * @param {Object} [cards] Each top-level property on the object is considered
   *        to be a card's name, its value is an object with `setup` and (optional) `teardown`
   *        properties
   * @return DOMNode
   */
  render({version, sections: sectionData}, root=createElement('div'), cards={}, options={}) {
    validateVersion(version);
    const [markerTypes, sections] = sectionData;
    cards.image = cards.image || ImageCard;
    const renderState = {root, markerTypes, cards, options};

    if (Array.isArray(cards)) {
      throw new Error('`cards` must be passed as an object, not an array.');
    }

    sections.forEach(section => {
      let rendered = renderSection(section, renderState);
      appendChild(renderState.root, rendered);
    });

    return root;
  }
}

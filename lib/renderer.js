import {
  createElement,
  appendChild,
  removeChild,
  createTextNode,
  setAttribute,
  createDocumentFragment
} from './utils/dom';
import ImageCard from './cards/image';
import RENDER_TYPE from './utils/render-type';

import {
  MARKUP_SECTION_TYPE,
  IMAGE_SECTION_TYPE,
  LIST_SECTION_TYPE,
  CARD_SECTION_TYPE
} from './utils/section-types';

const IMAGE_SECTION_TAG_NAME = 'img';
const CARD_ELEMENT_TAG_NAME = 'div';

import {
  isValidSectionTagName,
  isValidMarkerType
} from './utils/tag-names';

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

function validateVersion(version) {
  if (version !== '0.2.0') {
    throw new Error(`Unexpected Mobiledoc version "${version}"`);
  }
}

export default class Renderer {
  constructor(mobiledoc, state) {
    let { cards, cardOptions, atoms, unknownCardHandler } = state;
    let { version, sections: sectionData } = mobiledoc;
    validateVersion(version);

    const [markerTypes, sections] = sectionData;

    this.root               = createDocumentFragment();
    this.markerTypes        = markerTypes;
    this.sections           = sections;
    this.cards              = cards;
    this.atoms              = atoms;
    this.cardOptions        = cardOptions;
    this.unknownCardHandler = unknownCardHandler || this._defaultUnknownCardHandler;

    this._teardownCallbacks  = [];
    this._renderedChildNodes = [];
  }

  get _defaultUnknownCardHandler() {
    return ({env: {name}}) => {
      throw new Error(`Card "${name}" not found but no unknownCardHandler was registered`);
    };
  }

  render() {
    this.sections.forEach(section => {
      let rendered = this.renderSection(section);
      if (rendered) {
        appendChild(this.root, rendered);
      }
    });
    // maintain a reference to child nodes so they can be cleaned up later by teardown
    this._renderedChildNodes = Array.prototype.slice.call(this.root.childNodes);
    return { result: this.root, teardown: () => this.teardown() };
  }

  teardown() {
    for (let i=0; i < this._teardownCallbacks.length; i++) {
      this._teardownCallbacks[i]();
    }
    for (let i=0; i < this._renderedChildNodes.length; i++) {
      let node = this._renderedChildNodes[i];
      if (node.parentNode) {
        removeChild(node.parentNode, node);
      }
    }
  }

  renderSection(section) {
    const [type] = section;
    switch (type) {
      case MARKUP_SECTION_TYPE:
        return this.renderMarkupSection(section);
      case IMAGE_SECTION_TYPE:
        return this.renderImageSection(section);
      case LIST_SECTION_TYPE:
        return this.renderListSection(section);
      case CARD_SECTION_TYPE:
        return this.renderCardSection(section);
      default:
        throw new Error(`Cannot render mobiledoc section of type "${type}"`);
    }
  }

  renderMarkersOnElement(element, markers) {
    let elements = [element];
    let currentElement = element;

    for (let i=0, l=markers.length; i<l; i++) {
      let marker = markers[i];
      let [openTypes, closeCount, text] = marker;

      for (let j=0, m=openTypes.length; j<m; j++) {
        let markerType = this.markerTypes[openTypes[j]];
        let [tagName] = markerType;
        if (isValidMarkerType(tagName)) {
          let openedElement = createElementFromMarkerType(markerType);
          appendChild(currentElement, openedElement);
          elements.push(openedElement);
          currentElement = openedElement;
        } else {
          closeCount--;
        }
      }

      appendChild(currentElement, createTextNode(text));

      for (let j=0, m=closeCount; j<m; j++) {
        elements.pop();
        currentElement = elements[elements.length - 1];
      }
    }
  }

  renderListItem(markers) {
    const element = createElement('li');
    this.renderMarkersOnElement(element, markers);
    return element;
  }

  renderListSection([type, tagName, listItems]) {
    if (!isValidSectionTagName(tagName, LIST_SECTION_TYPE)) {
      return;
    }
    const element = createElement(tagName);
    listItems.forEach(li => {
      appendChild(element, (this.renderListItem(li)));
    });
    return element;
  }

  renderImageSection([type, src]) {
    let element = createElement(IMAGE_SECTION_TAG_NAME);
    element.src = src;
    return element;
  }

  findCard(name) {
    for (let i=0; i < this.cards.length; i++) {
      if (this.cards[i].name === name) {
        return this.cards[i];
      }
    }
    if (name === ImageCard.name) {
      return ImageCard;
    }
    return this._createUnknownCard(name);
  }

  _createUnknownCard(name) {
    return {
      name,
      type: RENDER_TYPE,
      render: this.unknownCardHandler
    };
  }

  _createCardArgument(card, payload={}) {
    let env = {
      name: card.name,
      isInEditor: false,
      onTeardown: (callback) => this._registerTeardownCallback(callback)
    };

    let options = this.cardOptions;

    return { env, options, payload };
  }

  _registerTeardownCallback(callback) {
    this._teardownCallbacks.push(callback);
  }

  renderCardSection([type, name, payload]) {
    let card = this.findCard(name);

    let cardWrapper = this._createCardElement();
    let cardArg = this._createCardArgument(card, payload);
    let rendered = card.render(cardArg);

    this._validateCardRender(rendered, card.name);

    if (rendered) {
      appendChild(cardWrapper, rendered);
    }
    return cardWrapper;
  }

  _createCardElement() {
    return createElement(CARD_ELEMENT_TAG_NAME);
  }

  _validateCardRender(rendered, cardName) {
    if (!rendered) {
      return;
    }

    if (typeof rendered !== 'object') {
      throw new Error(`Card "${cardName}" must render ${RENDER_TYPE}, but result was "${rendered}"`);
    }
  }

  renderMarkupSection([type, tagName, markers]) {
    if (!isValidSectionTagName(tagName, MARKUP_SECTION_TYPE)) {
      return;
    }

    const element = createElement(tagName);
    this.renderMarkersOnElement(element, markers);
    return element;
  }
}


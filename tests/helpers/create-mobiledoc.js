const MOBILEDOC_VERSION_0_3_2 = '0.3.2';
import {
  MARKUP_SECTION_TYPE,
  CARD_SECTION_TYPE
} from 'mobiledoc-dom-renderer/utils/section-types';
import {
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from 'mobiledoc-dom-renderer/utils/marker-types';

import { objectToSortedKVArray } from 'mobiledoc-dom-renderer/utils/array-utils';

export function createBlankMobiledoc({version=MOBILEDOC_VERSION_0_3_2}={}) {
  return {
    version,
    atoms: [],
    cards: [],
    markups: [],
    sections: []
  };
}

export function createMobiledocWithAtom({version=MOBILEDOC_VERSION_0_3_2, atom}={}) {
  return {
    version,
    atoms: [atom],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [ATOM_MARKER_TYPE, [], 0, 0]]
      ]
    ]
  };
}

export function createMobiledocWithCard({version=MOBILEDOC_VERSION_0_3_2, card}={}) {
  return {
    version,
    atoms: [],
    cards: [
      [card.name, card.payload || {}]
    ],
    markups: [],
    sections: [
      [CARD_SECTION_TYPE, 0]
    ]
  };
}

export function createSimpleMobiledoc({sectionName='p', text='hello world', markup=null, version=MOBILEDOC_VERSION_0_3_2, attributes={}}={}) {
  let openedMarkups = markup ? [0] : [];
  let closedMarkups = markup ? 1 : 0;
  let markups = markup ? [markup] : [];

  let section = [
    MARKUP_SECTION_TYPE,
    sectionName,
    [
      [MARKUP_MARKER_TYPE, openedMarkups, closedMarkups, text]
    ]
  ];

  if (version === MOBILEDOC_VERSION_0_3_2) {
    section.push(objectToSortedKVArray(attributes));
  }

  return {
    version,
    atoms: [],
    cards: [],
    markups: markups,
    sections: [section]
  };
}

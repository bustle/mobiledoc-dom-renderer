/* global QUnit */

import {
  kvArrayToObject,
  objectToSortedKVArray
} from 'mobiledoc-dom-renderer/utils/array-utils';

const { test, module } = QUnit;

module('Unit: Mobiledoc DOM Renderer - Array utils');

test('#kvArrayToObject', (assert) => {
  assert.deepEqual(
    kvArrayToObject([]),
    {}
  );
  assert.deepEqual(
    kvArrayToObject(['data-md-text-align', 'center']),
    {
      'data-md-text-align': 'center'
    }
  );
});

test('#objectToSortedKVArray', (assert) => {
  assert.deepEqual(
    objectToSortedKVArray({}),
    []
  );
  assert.deepEqual(
    objectToSortedKVArray(
      {
        'data-md-text-align': 'center'
      }
    ),
    [
      'data-md-text-align', 'center'
    ]
  );
  assert.deepEqual(
    objectToSortedKVArray(
      {
        'data-md-text-align': 'center',
        'data-md-color': 'red'
      }
    ),
    [
      'data-md-color', 'red',
      'data-md-text-align', 'center'
    ]
  );
});

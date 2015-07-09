var multiBuilder = require('broccoli-multi-builder');
var mergeTrees = require('broccoli-merge-trees');
var testBuilder = require('broccoli-test-builder');

var options = {
  packageName: 'mobiledoc-dom-renderer'
};

module.exports = mergeTrees([
  multiBuilder.build('amd', options),
  multiBuilder.build('global', options),
  testBuilder.build()
  // no need to build for CJS
]);

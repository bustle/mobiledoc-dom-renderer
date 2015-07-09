var multiBuilder = require('broccoli-multi-builder');
var mergeTrees = require('broccoli-merge-trees');

var options = {
  packageName: 'mobiledoc-dom-renderer'
};

module.exports = mergeTrees([
  multiBuilder.build('amd', options),
  multiBuilder.build('global', options)
  // no need to build for CJS
]);

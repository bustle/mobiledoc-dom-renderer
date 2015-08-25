var Funnel = require('broccoli-funnel');

module.exports = {
  name: "mobiledoc-dom-renderer",
  treeForVendor: function() {
    var files = new Funnel(__dirname + '/dist/', {
      files: [
        'global/mobiledoc-dom-renderer.js'
      ],
      destDir: 'mobiledoc-dom-renderer'
    });
    return files;
  },
  included: function(app) {
    app.import('vendor/mobiledoc-dom-renderer/global/mobiledoc-dom-renderer.js');
  }
};

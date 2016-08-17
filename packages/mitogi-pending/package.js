Package.describe({
  summary: 'Pending Posts',
  version: '0.1.0',
  name: 'mitogi:pending'
});

Package.onUse(function (api) {

  // ---------------------------------- 1. Core dependency -----------------------------------

  api.use("telescope:core");

  // ---------------------------------- 2. Files to include ----------------------------------


  // client & server

  api.addFiles([
    'lib/modules.js',
  ], ['client', 'server']);

  // client

  api.addFiles([
    'lib/client/templates/pending_post.html',
    'lib/client/templates/pending_post.js',
  ], ['client']);

});

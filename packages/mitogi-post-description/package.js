Package.describe({
  summary: 'Post descriptions',
  version: '0.1.0',
  name: 'mitogi:post-description'
});

Package.onUse(function (api) {

  // ---------------------------------- 1. Core dependency -----------------------------------

  api.use("telescope:core");

  // ---------------------------------- 2. Files to include ----------------------------------

  // client & server

  api.addFiles([
    'lib/custom_fields.js',
    'lib/template_modules.js',
  ], ['client', 'server']);

  // client

  api.addFiles([
    'lib/client/templates/post_description.html',
    'lib/client/stylesheets/custom.scss',
  ], ['client']);

  // server


});

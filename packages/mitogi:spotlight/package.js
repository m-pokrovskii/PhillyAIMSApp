Package.describe({
  summary: 'Spotlights on posts',
  version: '0.1.0',
  name: 'mitogi:spotlight'
});

Package.onUse(function (api) {

  // ---------------------------------- 1. Core dependency -----------------------------------

  api.use(["telescope:core",
    "tomi:upload-jquery",
    "tomi:upload-server",
    "manuel:reactivearray",
   // "browser-policy",
    "andruschka:bootstrap-image-gallery"
  ]);
  // ---------------------------------- 2. Files to include ----------------------------------

  // client & server

  api.addFiles([
    'lib/custom_fields.js',
    'lib/template_modules.js',
    'lib/spotlights.js',
  ], ['client', 'server']);

  // client

  api.addFiles([
    'main.css',


    'lib/client/templates/Spotlight.html',
    'lib/client/templates/Spotlight.js',
    'lib/client/templates/SpotlightUpload.html',
    'lib/client/templates/SpotlightUpload.js',
 
    'lib/client/templates/RouterHelper.js',

    'lib/client/templates/SpotlightTags.html',


    'lib/client/templates/partials/afImageUpload.html',
    'lib/client/templates/partials/afImageUpload.js',
  ], ['client']);

  api.addFiles([
    'lib/client/templates/post/custom_post_edit.html',
    'lib/client/templates/post/custom_post_edit.js',
    'lib/client/templates/post/custom_post_submit.html',
    'lib/client/templates/post/custom_post_submit.js',
    'lib/client/templates/post/custom_post_body.html',
    'lib/client/templates/post/custom_post_content.html',
    'lib/client/templates/post/custom_post_page.html',
    'lib/client/templates/post/custom_post_title.html',
  ], ['client']);

  // server

  api.addFiles([
    'lib/server/init.js',
    'lib/server/methods.js',
  ], ['server']);

  api.export('Spotlights');

});

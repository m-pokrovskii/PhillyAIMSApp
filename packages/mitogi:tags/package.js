Package.describe({
  name: "mitogi:tags",
  summary: "Telescope tags and yogiben autoform hybrid",
  version: "0.25.7"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['telescope:core@0.25.7']);

api.use([
    'templating',
    'reactive-var',
    'aldeed:autoform',
    'ajduke:bootstrap-tagsinput@0.7.0',
    'mitogi:spotlight'
  ], 'client');

  api.addFiles([
    'lib/tags.js',
    'lib/helpers.js',
    'lib/callbacks.js',
    'lib/parameters.js',
    'lib/custom_fields.js',
    'lib/methods.js',
    'lib/modules.js',
    'lib/routes.js',
    'package-tap.i18n'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/scss/tags.scss',
    'lib/client/templates/tags_admin.html',
    'lib/client/templates/tags_admin.js',
    'lib/client/templates/tag_item.html',
    'lib/client/templates/tag_item.js',
    'lib/client/templates/tags_menu.html',
    'lib/client/templates/tags_menu.js',
    'lib/client/templates/tags_menu_item.html',
    'lib/client/templates/tags_menu_item.js',
    'lib/client/templates/tag_title.html',
    'lib/client/templates/tag_title.js',
    'lib/client/templates/posts_tag.html',
    'lib/client/templates/post_tags.html',
    'lib/client/templates/post_tags.js',
    'lib/client/templates/autoform_tag.html',
    'lib/client/templates/autoform_tag.js'
    ], ['client']);

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  api.export([
    'Tags'
  ]);
});

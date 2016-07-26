Package.describe({
  name: "mitogi:search",
  summary: "Telescope search package",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/telescope-pages.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['telescope:core@0.25.7']);

  api.addFiles([
    'lib/search.js',
    'lib/parameters.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates/search.html',
    'lib/client/templates/search.js',
    'lib/client/stylesheets/search.scss'
    ], ['client']);

  api.addFiles([
    ], ['server']);

});

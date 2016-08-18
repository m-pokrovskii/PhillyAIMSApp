Package.describe({
  name: "mitogi:homescreen",
  summary: "Homescreen prompt",
  version: "0.25.7"
});

Package.onUse(function (api) {

  api.use("telescope:core");

  api.addFiles([
    'lib/client/templates/add_button.html',
    'lib/client/templates/add_button.js',
    'lib/client/templates/addtohomescreen.css',
    'lib/client/templates/addtohomescreen.min.js',
    'lib/client/templates/custom_modules.js',
    ], ['client']);

});

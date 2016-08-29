Package.describe({
  summary: 'The Meter Chef based S3 Upload',
  version: '0.1.0',
  name: 'mitogi:upload'
});

Package.onUse(function (api) {

  // ---------------------------------- 1. Core dependency -----------------------------------

  api.use(["telescope:core",
    //"standard-app-packages",
    "underscore",
    "jquery",
    "check",
    //"audit-argument-checks",
    "themeteorchef:jquery-validation",
    //"twbs:bootstrap",
    //"browser-policy",
    "themeteorchef:bert",
   // "meteorhacks:ssr",
   //"maxkferg:thumbnails",
   //"pascoual:pdfjs",
   "thinksoftware:image-resize-client",
   "tsega:bootstrap3-datetimepicker@=3.1.3_3",
   "aldeed:autoform-bs-datetimepicker",
   
   "jrudio:videojs",
   "peerlibrary:aws-sdk@2.4.9_1",
   //"lukemadera:video-capture",
    "froatsnook:request",
    "fourseven:scss",
    "standard-minifiers",
    "edgee:slingshot",
    "ecmascript",
    //"mdg:camera"
    ]);

  // ---------------------------------- 2. Files to include ----------------------------------


  api.addFiles([
    'lib/files.js',
    'lib/routes.js',
    'lib/both/methods/files.js',
    'lib/both/modules/_modules.js',
    'lib/both/modules/check-url-validity.js',

    
  ], ['client', 'server']);

  // client

  api.addFiles([
    'lib/client/templates/file.html',
    'lib/client/templates/file.js',
    'lib/client/templates/files.html',
    'lib/client/templates/files.js',
    'lib/client/templates/upload.html',
    'lib/client/templates/uploader.html',
    'lib/client/templates/uploader.js',

    //'lib/client/templates/test.html',
    //'lib/client/templates/test.js',

    'lib/client/templates/partials/afImageUpload.html',
    'lib/client/templates/partials/afImageUpload.js',

    'lib/client/modules/_modules.js',
    'lib/client/modules/upload-to-amazon.js',
    'lib/client/stylesheets/application.scss'
      ], ['client']);

  
  /*Npm.depends({
   "gulp-pdf-thumbnail":"0.0.7",
   "gulp" :"3.9.1",
   "pdfjs-dist": "1.5.376",
  });*/

  // server

  api.addFiles([
    'lib/server/slingshot_file.js',
    'lib/server/slingshot_create.js',
    'lib/server/publish.js',
    'lib/server/startup.js',
    'lib/server/methods.js'
  ], ['server']);

  //api.export('MyUploader', 'client');
  api.export('Files');

});

Settings.addField([
  {
    fieldName: 'terms',
    fieldSchema: {
      type: String,
      optional: true,
      label: "Terms",
      autoform: {
        group: "01_general",
        rows: 5,
        instructions: 'Specify Terms of Use.'
      }
    }
  }
]);


Settings.addField([
  {
    fieldName: 'splashUrl',
    fieldSchema: {
      type: String,
      optional: true,
      label: "Front Page Splash Image",
      defaultValue: function(){
        return "img/splash.png"
      },
      autoform: {
        type: "imageUpload",
        group: "01_general"
      }
    }
  }
]);
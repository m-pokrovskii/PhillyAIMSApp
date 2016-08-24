Settings.addField([
  {
    fieldName: 'terms',
    fieldSchema: {
      type: String,
      optional: true,
      label: "Terms of Use",
      autoform: {
        type: "summernote",
        group: "01_general",
        rows: 5,
        instructions: 'Specify Terms of Use.'
      }
    }
  }
]);

Settings.addField([
  {
    fieldName: 'announcement',
    fieldSchema: {
      type: String,
      optional: true,
      label: "FrontPage Announcement",
      autoform: {
        type: "summernote",
        group: "01_general",
        rows: 5,
        instructions: 'Announcement for homepage.'
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
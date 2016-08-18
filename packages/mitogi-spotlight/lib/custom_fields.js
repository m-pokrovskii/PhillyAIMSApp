/* Custom Post Field

Posts.removeField(fieldName);

Posts.addField({
  fieldName: 'spotlightID',
  fieldSchema: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    autoform: {
      type: "hidden",
      label: false
    },
  }
});

*/

Posts.removeField("thumbnailUrl");

Posts.addField(
  {
    fieldName: 'thumbnailUrl',
    fieldSchema: {
      type: String, //fileurl
      optional: true,
      editableBy: ["member", "admin"],
      autoform: {
        afFieldInput: {
          type: 'imageUpload',
          settings: "thumbnail" 
        },
        order: 20,
        label: false,
      }
    }
  }
);

Posts.removeField("url");
/*
Links = new SimpleSchema({
  title: {
    type: String,
    label: "Link Title",
    max: 200
  },
  url: {
    type: String,
    label: "URL"
  },
  description: {
    type: String,
    label: "Description"
  },
});



Posts.addField(
  {
    fieldName: 'links',
    fieldSchema: {
      type: [Links],
      optional: true,
      editableBy: ["member", "admin"]
    }
  }
);*/
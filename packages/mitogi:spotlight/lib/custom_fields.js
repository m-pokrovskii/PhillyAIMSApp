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
      type: String,
      optional: true,
      editableBy: ["member", "admin"],
      autoform: {
        type: 'imageUpload',
        order: 20
      }
    }
  }
);

Posts.removeField("url");
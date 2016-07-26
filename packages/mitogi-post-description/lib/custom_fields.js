// Custom Post Field

Posts.addField({
  fieldName: 'description',
  fieldSchema: {
    type: String,
    optional: true,
    editableBy: ["member", "admin"],
    max: 200
  }
});
Settings.addField([
  {
    fieldName: 'terms',
    fieldSchema: {
      type: String,
      optional: true,
      label: "Terms",
      autoform: {
        group: "01_general",
        instructions: 'Specify Terms of Use.'
      }
    }
  }
]);
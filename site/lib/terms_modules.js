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
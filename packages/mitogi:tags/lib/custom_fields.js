//done

Posts.addField(
  {
    fieldName: 'tags',
    fieldSchema: {
      type: [String],
      optional: true,
      editableBy: ["member", "admin"],
      autoform: {
        type: 'tags',
        order: 50,
        options: function () {
          var tags = Tags.find().map(function (tag) {
            return {
              value: tag._id,
              label: tag.name
            };
          });
          return tags;
        }
      }
    }
  }
);

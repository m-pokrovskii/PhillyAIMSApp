//almost done: category_item

Template.tags_admin.helpers({
  tags: function(){
    return Tags.find({}, {sort: {order: 1, name: 1}});
  },
  menuItems: function () {
    var menuItems = _.map(Tags.find({}, {sort: {order: 1, name: 1}}).fetch(), function (tag) {
      return {
        _id: tag._id,
        template: "tag_item",
        data: tag
      };
    });
    return menuItems;
  },
});

var getRoute = function () {
  FlowRouter.watchPathChange()
  var tagName = this.data.slug;
  var currentQuery = _.clone(FlowRouter.current().queryParams);
  var newQuery = _.extend(currentQuery, {tag: tagName});
  return FlowRouter.path("postsDefault", FlowRouter.current().params, newQuery);
};

Meteor.startup(function () {
  Template.tags_menu.helpers({
    hasTags: function () {
      return Tags.find().count();
    },
    menuLabel: function () {
      return "Tags";
    },
    menuItems: function () {

      var activeTags = FlowRouter.getQueryParam("tag");

      var defaultItem = [{
        route: "postsDefault",
        label: "All Tags",
        itemClass: "item-never-active",
        template: "defaultMenuItem"
      }];

      var menuItems = Tags.find({}, {sort: {order: 1, name: 1}}).fetch();

      // filter out tags with no items
      if (Settings.get("hideEmptyTags", false)) {
        menuItems = _.filter(menuItems, function (tag){
          return !!Counts.get(tag.getCounterName());
        });
      }

      menuItems = _.map(menuItems, function (tag) {

        return {
          route: getRoute,
          label: tag.name+=" <span class=\"tag-posts-count\">("+Counts.get(tag.getCounterName())+")</span>",
          description: tag.description,
          _id: tag._id,
          parentId: tag.parentId,
          itemClass: "tag-"+tag.slug,
          data: tag
        };
      });

      return defaultItem.concat(menuItems);
    },
    expandLevel: function () {
      if (this.zone === "mobileNav") {
        return 0;
      } else {
        return 1;
      }
    },
    menuType: function () {
      if (this.zone === "mobileNav") {
        return 'collapsible';
      } else if (Settings.get('navLayout', 'top-nav') === 'top-nav') {
        return 'dropdown';
      } else {
        return 'collapsible';
      }
    }
  });
});

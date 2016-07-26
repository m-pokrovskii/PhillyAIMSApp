Template.tag_title.helpers({
  tags: function () {
    var slugs = FlowRouter.getQueryParam("tag");
    if (typeof slugs !== "undefined") {
      if (typeof slugs === "string") {
        slugs = [slugs];
      }
      return Tags.find({slug: {$in: slugs}});
    }
  },
  title: function () {
    var tag = this;
    return tag && tag.name;
  }
});
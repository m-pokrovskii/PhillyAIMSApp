
Template.post_tags.helpers({
  tagsLink: function(){
    return Tags.getUrl(this.toString());
  }
});

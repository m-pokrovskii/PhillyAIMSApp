//done

Meteor.methods({
  removeTag: function (tagId) {
    
    check(tagId, String);

    if (!!this.userId) {

      var tag = Tags.findOne(tagId);

      // delete category
      Tags.remove(tagId);

      // find any post with this category and remove it
      var postsUpdated = Posts.update({tags: {$in: [tagId]}}, {$pull: {tags: tagId}}, {multi: true});

      return postsUpdated;

    }
  }
});
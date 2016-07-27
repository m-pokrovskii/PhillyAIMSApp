//Announcements._ensureIndex({"status": 1, "postedAt": 1});

// Publish a list of posts

Meteor.publish('announcementList', function(terms) {

  this.unblock();
    var parameters = Announcements.parameters.get(terms),
        announcements = Announcements.find(parameters.find, parameters.options);

    return announcements;

});


// Publish a single announcement

Meteor.publish('singleAnnouncement', function(announcementId) {

  check(announcementId, String);
  this.unblock();

  var announcement = Announcements.findOne(announcementId);
  
  return announcement;

});
/*
// Publish author of the current post, authors of its comments, and upvoters of the post

Meteor.publish('postUsers', function(postId) {

  check(postId, String);
  this.unblock();

  if (Users.can.viewById(this.userId)){
    // publish post author and post commenters
    var post = Posts.findOne(postId);
    var users = [];

    if (post) {

      users.push(post.userId); // publish post author's ID

      // get IDs from all commenters on the post
      var comments = Comments.find({postId: post._id}).fetch();
      if (comments.length) {
        users = users.concat(_.pluck(comments, "userId"));
      }

      // publish upvoters
      if (post.upvoters && post.upvoters.length) {
        users = users.concat(post.upvoters);
      }

      // publish downvoters
      if (post.downvoters && post.downvoters.length) {
        users = users.concat(post.downvoters);
      }

    }

    // remove any duplicate IDs
    users = _.unique(users);

    return Meteor.users.find({_id: {$in: users}}, {fields: Users.pubsub.publicProperties});
  }
  return [];
});
*/
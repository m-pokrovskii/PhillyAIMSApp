Template.user_posts.helpers({
  isUser: function(){
    var user = this;
    return user._id === Meteor.userId();
  },
  argumentsPending: function () {
    var user = this;
    var args = {
      template: "posts_list_compact",
      options: {
        currentUser: user,
        fieldLabel: i18n.t("postedAt"),
        fieldValue: function (post) {
          return moment(post.postedAt).format("MM/DD/YYYY, HH:mm");
        }
      },
      terms: {
        view: 'pending',
        userId: user._id,
        status: 1,
        limit: 5,
        enableCache: false,
        subscribeToUsers: false
      }
    };
    return args;
  },
    argumentsApproved: function () {
    var user = this;
    var args = {
      template: "posts_list_compact",
      options: {
        currentUser: user,
        fieldLabel: i18n.t("postedAt"),
        fieldValue: function (post) {
          return moment(post.postedAt).format("MM/DD/YYYY, HH:mm");
        }
      },
      terms: {
        view: 'approved',
        userId: user._id,
        status: 2,
        limit: 5,
        enableCache: false,
        subscribeToUsers: false
      }
    };
    return args;
  }
});
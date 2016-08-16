Template.pending_post.helpers({
  arguments: function () {
    var user = this;
    var args = {
      terms: {
        view: 'pending',
        status: 1,
        userId: user._id,
        limit: Template.instance().data.limit,
        enableCache: false,
        subscribeToUsers: false
      }
    };
    return args;
  }

});
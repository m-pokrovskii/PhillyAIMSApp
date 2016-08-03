var PostsController = FlowRouter.group({
    name: 'posts',
    triggersEnter: [function(context, redirect) {
            authenticating(context.path);
        }]
});

function authenticating(path) {
    if(!Meteor.loggingIn() && !Meteor.userId()){
        FlowRouter.go('signIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    }
}

PostsController.route('/posts', {
  name: "postsDefault",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "main_posts_list"});
  }
});

PostsController.route('/posts/:_id/edit', {
  name: "postEdit",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "post_edit"});
  }
});

PostsController.route('/posts/:_id/:slug?', {
  name: "postPage",
  action: function(params, queryParams) {
    //trackRouteEntry(params._id);
    trackRouteEntry(params);
    BlazeLayout.render("layout", {main: "post_page"});
  }
});

PostsController.route('/posts/:_id/?', {
  name: "postPage2",
  action: function(params, queryParams) {
    trackRouteEntry(params);
    BlazeLayout.render("layout", {main: "post_page"});
  }
});

var trackRouteEntry = function (params) {
  var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
  Meteor.call('increasePostViews', params._id, sessionId);
}

FlowRouter.route('/submit', {
  name: "postSubmit",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "post_submit"});
  }
});
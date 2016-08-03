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
    //trackRouteEntry(params);
    BlazeLayout.render("layout", {main: "post_page"});
  }
});

PostsController.route('/posts/:_id/?', {
  name: "postPage2",
  action: function(params, queryParams) {
    
    BlazeLayout.render("layout", {main: "post_page"});
  }
});


FlowRouter.route('/submit', {
  name: "postSubmit",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "post_submit"});
  }
});
Telescope.adminRoutes.route('/users', {
  name: "adminUsers",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "admin_wrapper", admin: "users_dashboard"});
  }
});

var UsersController = FlowRouter.group({
    name: 'users',
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

UsersController.route('/users/:_idOrSlug', {
  name: "userProfile",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "user_controller", userTemplate: "user_profile"});
  }
});

UsersController.route('/users/:_idOrSlug/edit', {
  name: "userEdit",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "user_controller", userTemplate: "user_edit"});
  }
});

FlowRouter.route('/account', {
  name: "userAccountShortcut",
  triggersEnter: [function(context, redirect) {
    redirect("userEdit", {_idOrSlug: Meteor.userId()});
  }]
});

FlowRouter.route('/sign-out', {
  name: "signOut",
  triggersEnter: [function(context, redirect) {
    AccountsTemplates.logout();
    Bert.alert(i18n.t("you_have_been_logged_out"), "success", "fixed-top");
    FlowRouter.go("/sign-in");
  }]
});
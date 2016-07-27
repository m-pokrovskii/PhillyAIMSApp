var AnnouncementsController = FlowRouter.group({
    name: 'AnnouncementsController',
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

AnnouncementsController.route('/announcements', {
  name: "announcementsDefault",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "main_announcements_list"});
  }
});

PostsController.route('/announcements/:_id/edit', {
  name: "postEdit",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "announcement_edit"});
  }
});

PostsController.route('/announcements/:_id/', {
  name: "announcementsPage",
  action: function(params, queryParams) {
    trackRouteEntry(params);
    BlazeLayout.render("layout", {main: "announcement_page"});
  }
});

var trackRouteEntry = function (context) {
  var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
  Meteor.call('increaseAnnouncementViews', context.params._id, sessionId);
}

FlowRouter.route('/announcements/submit', {
  name: "announcementSubmit",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "announcement_submit"});
  }
});
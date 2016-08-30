FlowRouter.route('/users/bulk', {
  name: "bulkMakeUsers",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "bulkUsers"});
  }
});




// Account approved email
Picker.route('/email/bulk-add/?', function(params, req, res, next) {
  var user = typeof params.id === "undefined" ? Meteor.users.findOne() : Meteor.users.findOne(params.id);
  var emailProperties = {
    changePwdUrl: FlowRouter.path("changePwd"),
    username: Users.getUserName(user),
    password: Random.id(5),
    siteTitle: Settings.get('title'),
    siteUrl: Telescope.utils.getSiteUrl()
  };
  var html = Telescope.email.getTemplate('emailAdd')(emailProperties);
  res.end(Telescope.email.buildTemplate(html));
});
FlowRouter.route('/users/bulk', {
  name: "bulkMakeUsers",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "bulkUsers"});
  }
});
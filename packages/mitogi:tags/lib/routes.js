Telescope.adminRoutes.route('/tags', {
  name: "adminTags",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "admin_wrapper", admin: "tags_admin"});
  }
});

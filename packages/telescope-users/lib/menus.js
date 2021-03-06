Telescope.modules.add("secondaryNav", [
  {
    template: 'user_menu',
    order: 10
  }
]);

Telescope.modules.add("mobileNav", [
  {
    template: 'user_menu',
    order: 20
  }
]);

var userMenuItems = [
  {
    route: function () {
      var user = Meteor.user();
      return FlowRouter.path('userProfile', {_idOrSlug: user && user.telescope && user.telescope.slug});
    },
    label: 'profile',
    order:10,
    // description: 'view_your_profile'
  },
  {
    route: function () {
      var user = Meteor.user();
      return FlowRouter.path('userEdit', {_idOrSlug: user && user.telescope && user.telescope.slug});
    },
    label: 'edit_account',
    order:20,
    // description: 'edit_your_profile'
  },
  {
    route: 'adminSettings',
    label: 'settings',
    // description: 'settings',
    adminOnly: true,
    order:30,
  },
  {
    route: 'signOut',
    label: 'sign_out',
    order:40,
    // description: 'sign_out'
  }
];

Telescope.menuItems.add("userMenu", Telescope.menuItems.internationalize(userMenuItems));

// array containing items in the admin menu
Telescope.menuItems.add("adminMenu", [
  {
    route: 'adminUsers',
    label: "users",
    description: "users_dashboard"
  }
]);
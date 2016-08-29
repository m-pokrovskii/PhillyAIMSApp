
Telescope.menuItems.add("userMenu", {
  route: 'addUsers',
  label: 'Add Users',
  adminOnly: true,
  order:35,
 });

Telescope.modules.add("makeUser", {
  template: "user_invites",
  order: 10
});

/*
AccountsTemplates.configureRoute('signUp', {
    name: 'signUp',
    path: "/"+Random.hexString(16),
});
*/

AccountsTemplates.configure({
    // Behavior
    hideSignUpLink: true,
    forbidClientAccountCreation: false
});



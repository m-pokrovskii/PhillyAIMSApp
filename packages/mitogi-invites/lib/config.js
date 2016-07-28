
Telescope.menuItems.add("userMenu", {
  route: 'makeInvites',
  label: 'Invites',
  adminOnly: true,
  order:40,
 });


AccountsTemplates.configureRoute('signUp', {
    name: 'signUp',
    path: "/"+Random.hexString(16),
});

AccountsTemplates.configure({
    // Behavior
    hideSignUpLink: true,
    forbidClientAccountCreation: false
});



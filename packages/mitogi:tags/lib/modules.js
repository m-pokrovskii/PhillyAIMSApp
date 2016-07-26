//Almost done, put tags in sidebar

Telescope.menuItems.add("adminMenu", {
  route: 'adminTags',
  label: 'Tags',
  description: 'Manage tags'
});



Telescope.modules.add("postSidebar", [
  {
    template: 'post_tags',
    order: 10
  }
]);

/*
Telescope.modules.add("postsListTop", {
  template: 'category_title',
  order: 10,
  only: ["postsDefault"]
});*/

// we want to wait until categories are all loaded to load the rest of the app
Telescope.subscriptions.preload('tags');

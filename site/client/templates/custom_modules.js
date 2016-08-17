//Telescope.modules.remove("secondaryNav", "search");

Telescope.modules.add("mobileCenter", "search");

Telescope.modules.add("postsListTop", [
  {
    template: "add_button",
    order: -2,
    only: ["home"]
  }
]);
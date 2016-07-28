/**
 * Post views are filters used for subscribing to and viewing posts
 * @namespace Posts.views
 */
Announcements.views = {};

/**
 * Add a post view
 * @param {string} viewName - The name of the view
 * @param {function} [viewFunction] - The function used to calculate query terms. Takes terms and baseParameters arguments
 */
Announcements.views.add = function (viewName, viewFunction) {
  Announcements.views[viewName] = viewFunction;
};

/**
 * New view
 */
Announcements.views.add("new", function (terms) {
  return {
    options: {sort: {sticky: -1, postedAt: -1}}
  };
});
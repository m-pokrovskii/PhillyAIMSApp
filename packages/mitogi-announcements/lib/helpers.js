//////////////////
// Link Helpers //
//////////////////

/**
 * Get URL of a post page.
 * @param {Object} post
 */
Announcements.getLink = function(announcement, isAbsolute){
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return prefix + FlowRouter.path("announcementPage", announcement);
};
Announcements.helpers({getLink: function (isAbsolute) {return Announcements.getLink(this, isAbsolute);}});

/**
 * Get post edit page URL.
 * @param {String} id
 */
Announcements.getEditUrl = function(announcement, isAbsolute){
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return prefix + FlowRouter.path("announcementEdit", announcement);
};
Announcements.helpers({getEditUrl: function (isAbsolute) {return Announcements.getEditUrl(this, isAbsolute);}});

/**
 * When on a post page, return the current post
 */
Announcements.current = function () {
  return Announcements.findOne(FlowRouter.getParam("_id"));
};
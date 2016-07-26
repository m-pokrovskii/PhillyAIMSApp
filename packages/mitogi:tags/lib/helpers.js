//done

/**
 * Get all of a post's tags
 * @param {Object} post
 */
Posts.getTags = function (post) {
  return !!tags.tags ? Tags.find({_id: {$in: post.tags}}).fetch() : [];
};
Posts.helpers({getTags: function () {return Posts.getTags(this);}});

/**
 * Get a tag's URL
 * @param {Object} tag
 */
Tags.getUrl = function (tag, isAbsolute) {
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  // return prefix + FlowRouter.path("postsCategory", category);
  return prefix + FlowRouter.path("postsDefault", {}, {tag: tag});
};
Tags.helpers({getUrl: function () {return Tags.getUrl(this);}});

/**
 * Get a tag's counter name
 * @param {Object} tag
 */
 Tags.getCounterName = function (tag) {
  return tag._id + "-postsCount";
 }
Tags.helpers({getCounterName: function () {return Tags.getCounterName(this);}});

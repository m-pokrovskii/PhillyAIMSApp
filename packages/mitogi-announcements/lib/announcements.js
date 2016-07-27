
/**
 * Posts schema
 * @type {SimpleSchema}
 */
Announcements.schema = new SimpleSchema({
  /**
    ID
  */
  _id: {
    type: String,
    optional: true
  },
  /**
    Timetstamp of post creation
  */
  createdAt: {
    type: Date,
    optional: true
  },
  /**
    Title
  */
  title: {
    type: String,
    optional: false,
    max: 500,
    editableBy: ["member", "admin"],
    autoform: {
      order: 20
    }
  },
  /**
    Post body (markdown)
  */
  body: {
    type: String,
    optional: true,
    max: 3000,
    editableBy: ["member", "admin"],
    autoform: {
            type: "summernote"
        }
  },
  /**
    HTML version of the post body
  */
  htmlBody: {
    type: String,
    optional: true
  },
  /**
    Count of how many times the post's page was viewed
  */
  viewCount: {
    type: Number,
    optional: true
  },
  /**
    Count of the post's comments
  */
  commentCount: {
    type: Number,
    optional: true
  },
  /**
    An array containing the `_id`s of commenters
  */
  commenters: {
    type: [String],
    optional: true
  },
  /**
    Timestamp of the last comment
  */
  lastCommentedAt: {
    type: Date,
    optional: true
  },
  /**
    Count of how many times the post's link was clicked
  */
  clickCount: {
    type: Number,
    optional: true
  },
    /**
    Timestamp of post first appearing on the site (i.e. being approved)
  */
  postedAt: {
    type: Date,
    label: "Post At",
    optional: true,
    editableBy: ["admin"],
    autoform: {
      group: 'admin',
      type: "bootstrap-datetimepicker"
    }
  },
  /**
    Whether the post is sticky (pinned to the top of posts lists)
  */
  sticky: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    editableBy: ["admin"],
    autoform: {
      group: 'admin',
      leftLabel: "Sticky"
    }
  },
  /**
    The post author's name
  */
  author: {
    type: String,
    optional: true
  },
});


/**
 * Attach schema to Posts collection
 */
Announcements.attachSchema(Announcements.schema);

Announcement.allow({
  insert: function(){return User.is.admin(Meteor.userId())},
  update: function(){return User.is.admin(Meteor.userId())},
  remove: function(){return User.is.admin(Meteor.userId())},
});


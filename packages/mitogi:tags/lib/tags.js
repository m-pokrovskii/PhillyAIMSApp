//Done

Tags = new Mongo.Collection("tags");

// category schema
Tags.schema = new SimpleSchema({
  name: {
    type: String,
    editableBy: ["admin","member"]
  }
});

Tags.attachSchema(Tags.schema);

Meteor.startup(function () {
  Tags.allow({
    insert: function(){
      return !!this.userId; //Meteor.userId(), //Users.is.adminById,
    },
    update: function(){
      return !!this.userId; //Meteor.userId(), //Users.is.adminById,
    },//Meteor.userId(),  //Users.is.adminById,
    remove: function(){
      return !!this.userId; //Meteor.userId(), //Users.is.adminById,
    }, //Meteor.userId(), //Users.is.adminById
  });
});


Meteor.methods({
  insertTags: function(tags){
    tags.each(function(tag){
        if(!!Tags.find({name: tag})){
          Tags.insert({name: tag});
        }
    });
  },
  deleteTags: function(tag){
    Tags.remove({name: tag});
  }
});

Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};
//done

Meteor.publish('tags', function() {
  if(Users.can.viewById(this.userId)){
    var tags = Tags.find();
    return tags;
  }
  return [];
});
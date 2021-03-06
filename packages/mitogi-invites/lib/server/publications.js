Meteor.publish('invites', function (userId) {
  //var invites = Invites.find({invitingUserId: userId});
  var invites = Users.is.adminById(this.userId) ? Invites.find() : Invites.find({invitingUserId: userId});
  return (this.userId === userId || Users.is.adminById(this.userId)) ? invites : [];
});

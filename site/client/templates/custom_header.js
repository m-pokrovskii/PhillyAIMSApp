window.shouldRotateToOrientation = function(degrees) {
 return true;
}

Template.header.helpers({
  'isCordova': function(e){
    return Meteor.isCordova;
  },
  'user': function(e){
    return !!Meteor.isUserId();
  }
});

Template.header.events({
  'click #back-button': function(e){
    e.preventDefault();
    e.stopPropagation(); // Make sure we don't immediately close the mobile nav again. See layout.js event handler.
    FlowRouter.go(history.back());
  }
});

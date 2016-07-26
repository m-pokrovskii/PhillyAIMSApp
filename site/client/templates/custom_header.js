window.shouldRotateToOrientation = function(degrees) {
 return true;
}

Template.registerHelper("and", function(one, two) {
  if (one && two) {
    return true;
  } 
});

Template.registerHelper("not", function(thing) {
    return !thing;
});

Template.header.helpers({
  'isNotCordova': function(e){
    return !Meteor.isCordova;
  }
});

Template.header.events({
  'click #back-button': function(e){
    e.preventDefault();
    e.stopPropagation(); // Make sure we don't immediately close the mobile nav again. See layout.js event handler.
    FlowRouter.go(history.back());
  }
});

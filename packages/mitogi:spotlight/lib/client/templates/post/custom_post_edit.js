Template.post_edit.onCreated(function(){
	Session.set('resourceID', FlowRouter.getParam("_id"));
});

Template.post_edit.helpers({
	userIsAdmin: function(){
	    return Users.is.admin(this);
	  },
});

Template.post_edit.events({
'click .approve-link': function(e){
    Meteor.call('approvePost', this._id);
    Bert.alert( 'The Post has been approved', 'success', 'growl-top-right' );
    e.preventDefault();
  }
});
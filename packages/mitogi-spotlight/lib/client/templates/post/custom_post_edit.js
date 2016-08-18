Template.post_edit.onCreated(function(){
	Session.set('resourceID', FlowRouter.getParam("_id"));
});

Template.post_edit.helpers({
	userIsAdmin: function(){
		console.log("admin check");
	    return Users.is.admin(Meteor.user());
	  },
});

Template.post_edit.events({
'click .approve-link': function(e){
    Meteor.call('approvePost', FlowRouter.getParam("_id"));
    Bert.alert( 'The Post has been approved', 'success', 'growl-top-right' );
    e.preventDefault();
    FlowRouter.reload();
  }
});
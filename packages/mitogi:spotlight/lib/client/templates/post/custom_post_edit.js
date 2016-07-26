Template.post_edit.onCreated(function(){
	Session.set('resourceID', FlowRouter.getParam("_id"));
});
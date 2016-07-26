/*
* Routes: Authenticated
* Routes that are only visible to authenticated users.
*/


FlowRouter.route('/uploadTest', {
    action: function() {
    	BlazeLayout.render('uploadNew');
 	 }
});
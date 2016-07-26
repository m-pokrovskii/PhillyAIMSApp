Accounts.createUser = _.wrap(Accounts.createUser, function(createUser) {
	var callback = origCallback;
	if(Settings.get("requireViewInvite")){
	    // Store the original arguments
	    var args = _.toArray(arguments).slice(1),
	        user = args[0];
	        origCallback = args[1];

	    callback = function(error) {
	        // do my stuff
	        Invites.findOne({invitedUserEmail: user.email}).role;
	        user.isAdmin = true;
	        Users.update({email: user.email}, {$set:{isAdmin: true}});
	        origCallback.call(this, error);
	    };
	}
    createUser(user, callback);
});
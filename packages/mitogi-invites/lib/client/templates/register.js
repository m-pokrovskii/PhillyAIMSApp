Template.register.onRendered(function(){
	//this.find("#at-field-email").value = ;
	//change type to hidden
	$("#at-field-email").each(function() {
	   $("<input type='hidden' />").attr({ name: "at-field-email", id: "at-field-email", value: FlowRouter.getParam("email") }).insertBefore(this);
	}).remove();
	$('label[for="at-field-email"]').remove();
});

Template.register.events({
	'click #terms': function(){
		Session.set('modalTitle', 'Terms');
		Session.set('modalBody', Settings.get("terms"));
	}
});

/*Template.register.onCreated(function(){
	this.email = new ReactiveVar(FlowRouter.getParam("email"));
	this.token = new ReactiveVar(FlowRouter.getParam("token"));
});

Template.register.helpers({
	terms: function(){
		return Settings.get("userTerms");
	}
});



Template.register.events({
	'submit #register-form' : function(e, t) {
	  e.preventDefault();
	  var username = t.find('#account-username').value
	    , password = t.find('#account-password').value
	    , password1 = t.find('#account-password1').value
	    , terms = $('#terms-box').is(":checked");//terms = $('input').is(":checked").val(); 

	    // Trim and validate the input
	    var trimInput = function(val) {
			return val.replace(/^\s*|\s*$/g, "");
		}

		var isValidPassword = function(val) {
		 return val.length >= 6 ? true : false; 
		}

		var allGood = true;
		if (!isValidPassword(password)) {
			allGood = false;
			Bert.alert( 'Password should be 6 characters or longer', 'danger', 'growl-top-right', 'fa-frown-o' );
		}

		if (!terms) {
			allGood = false;
			Bert.alert( 'You need to accept the terms and services.', 'danger', 'growl-top-right', 'fa-frown-o' );
		}

		if (password!==password1) {
			allGood = false;
			Bert.alert( "Passwords don't match", 'danger', 'growl-top-right', 'fa-frown-o' );
		}

		if (password!==password1) {
			allGood = false;
			Bert.alert( "Passwords don't match", 'danger', 'growl-top-right', 'fa-frown-o' );
		}

		if (!/^([A-Za-z0-9_.]{5,20})$/.test(username) ) {
			allGood = false;
			Bert.alert( "Usernames should contain only alphanumerics, underscores, and dots and be between 5-20 characters long.", 'danger', 'growl-top-right', 'fa-frown-o' );
		}

		Meteor.call('checkInvitedUsers', username, t.email.get(), function(error){
			if(error){
				 Bert.alert( error, 'danger', 'growl-top-right', 'fa-check' );
			}
			if(allGood){
				Meteor.call('makeInvitedUser', username, password,t.email.get() ,function(error, result){
						if (error) {
			               Bert.alert( err, 'danger', 'fixed-top', 'fa-frown-o' );
			         	   return err;
				        } 
				        else {
				          Bert.alert( 'You successfully registered!', 'success', 'growl-top-right', 'fa-check' );
				          FlowRouter.go("/");
				        }
			    });
			}
		});
			
	}
});
*/

/*Template.register.onRendered(function(){
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
});*/

Template.register.onCreated(function(){
	this.email = new ReactiveVar(FlowRouter.getParam("email"));
	this.token = new ReactiveVar(FlowRouter.getParam("token"));
});

Template.register.helpers({
	terms: function(){
		return Settings.get("userTerms");
	},
	email : function(){
		return Template.instance().email.get();
	}
});



Template.register.events({
	'submit #register-form' : function(e, t) {
	  e.preventDefault();
	  var username = t.find('#account-username').value
	    , password = t.find('#account-password').value
	    , password1 = t.find('#account-password1').value
	    , email = t.find('#account-email').value ? t.find('#account-email').value : t.email.get()
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

		if (!/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(email) ) {
			allGood = false;
			Bert.alert( "Not a valid email.", 'danger', 'growl-top-right', 'fa-frown-o' );
		}
		if(allGood){
			if(Settings.get("requireViewInvite")){
				Meteor.call('checkInvitedUsers', username, email, function(error){
					if(error){
						 Bert.alert( error, 'danger', 'growl-top-right', 'fa-check' );
					}
					else{
					
						Meteor.call('makeInvitedUser', username, password, email ,function(error, userId){
								if (error) {
					               Bert.alert( error, 'danger', 'growl-top-right', 'fa-check' );
						        } 
						        else {
						          Bert.alert( 'You successfully registered! ', 'success', 'growl-top-right', 'fa-check' );
						          Meteor.connection.setUserId(userId);
						          FlowRouter.go("/");
						        }
					    });
					}
				});
			}
			else{

				Meteor.call('makeInvitedUser', username, password, email ,function(error, userId){
						if (error) {
			               Bert.alert( error, 'danger', 'growl-top-right', 'fa-check' );
				        } 
				        else {
				          Bert.alert( 'You successfully registered! ', 'success', 'growl-top-right', 'fa-check' );
				          Meteor.connection.setUserId(userId);
				          FlowRouter.go("/");
				        }
			    });

			}
		}
			
	}
});


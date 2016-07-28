Template.user_invites.created = function () {

  var userId = Meteor.userId();//this.data;
  var instance = this;

  instance.invites = new ReactiveVar({});

  Meteor.autorun(function () {
    Telescope.subsManager.subscribe('invites', userId);
    var invites = Invites.find({invitingUserId: userId});
    instance.invites.set(invites);
  });
};

Template.user_invites.helpers({
  canCurrentUserInvite: function () {
    var currentUser = Meteor.user();
    return currentUser && (Users.is.admin(currentUser) || currentUser.telescope.inviteCount > 0 && Users.can.invite(currentUser));
  },
  invitesLeft: function () {
    var currentUser = Meteor.user();
    return (currentUser && !(Users.is.admin(currentUser))) ? (currentUser.telescope.inviteCount - currentUser.telescope.invitedCount) : 0
  },
  invitesSchema: function () {
    // expose schema for Invites (used by AutoForm)
    return Invites.simpleSchema();
  },
  invites: function () {
    return Template.instance().invites.get();
  },
  userIsAdmin: function () {
    return Users.is.admin(this);
  }
});

Template.user_invites.events({
  'click .resend': function (event) {
    event.preventDefault();
    var email = event.target.getAttribute('data-email');
    Meteor.call('resend', email, function(error, result){
      if(error){
        Bert.alert( 'Error '+error, 'danger', 'growl-top-right' );
      }
      else{
        Bert.alert( 'An invite has been resent out. Thank you!', 'success', 'growl-top-right' );
      }
    });
    
  },
  'click .delete': function (event) {
    event.preventDefault();
    var email = event.target.getAttribute('data-email');
    if (window.confirm("Are you sure?")) {
      Meteor.call('deleteInvite', email, function(error, result){
        if(error){
          Bert.alert( 'Error '+error, 'danger', 'growl-top-right' );
        }
        else{
          Bert.alert( 'Delete successful!', 'success', 'growl-top-right' );
        }
      });
    }
  }
});

var scrollUp = function(){
  Deps.afterFlush(function() {
    var element = $('.grid > .error');
    $('html, body').animate({scrollTop: element.offset().top});
  });
};

AutoForm.hooks({
  inviteForm: {
    /*before: {
      insert: function(doc){
        doc.token = Random.hexString(16);
        return doc;
      },
      update: function(doc){
        doc.token = Random.hexString(16);
        return doc;
      }
    },*/
    onSuccess: function(operation, result) {
      //Messages.clearSeen();

      if(result && result.newUser){
        Bert.alert( 'An invite has been sent out. Thank you!', 'success', 'growl-top-right' );
      } else {
        Bert.alert( 'An invite has been sent out. Thank you!', 'success', 'growl-top-right' );
        //Messages.flash('Thank you!', "info");
      }
      //scrollUp();

      console.log(result);
    },

    onError: function(operation, error) {
      //Messages.clearSeen();

      if(error && error.reason){
        Bert.alert( 'Error '+error.reason, 'danger', 'growl-top-right' );
      }
      console.log(error);
    }
  }
});

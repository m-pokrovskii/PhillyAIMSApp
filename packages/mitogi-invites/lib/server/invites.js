Meteor.methods({
  makeInvitedUser: function(username, password, email){
 
      Accounts.createUser({username: username, password : password, email: email });

  },
  checkInvitedUsers: function(username, email){
      if(Users.findOne({email:email})){
        throw new Meteor.Error("Email Exists", "That email already has an account.");
      }
      else if(Users.findOne({username:username})){
        throw new Meteor.Error("Username Taken", "This username is already taken.");
      }
      else{
        return true;
      }
  },
  inviteUser: function(invitation){

    check(invitation, Match.Any);
    
    // invite user returns the following hash
    // { newUser : true|false }
    // newUser is true if the person being invited is not on the site yet

    // invitation can either contain userId or an email address :
    // { invitedUserEmail : 'bob@gmail.com' } or { userId : 'user-id' }
    console.log(invitation.invitedUserEmail);
    console.log(invitation);

    /*check(invitation, Match.OneOf(
      { invitedUserEmail : String },
      { userId : String }
    ));*/

    check(invitation.invitedUserEmail, String);

    var user = invitation.invitedUserEmail ?
          Meteor.users.findOne({ emails : { $elemMatch: { address: invitation.invitedUserEmail } } }) :
          Meteor.users.findOne({ _id : invitation.userId });
    
    var userEmail = invitation.invitedUserEmail ? invitation.invitedUserEmail :Users.getEmail(user);
    var currentUser = Meteor.user();
    var currentUserIsAdmin = Users.is.admin(currentUser);
    var currentUserCanInvite = currentUserIsAdmin || (currentUser.telescope.inviteCount > 0 && Users.can.invite(currentUser));

    // check if the person is already invited
    if(user && Users.is.invited(user)){
      throw new Meteor.Error(403, "This person is already invited.");
    } else {
      if (!currentUserCanInvite){
        throw new Meteor.Error(701, "You can't invite this user, sorry.");
      }

      // don't allow duplicate multiple invite for the same person
      var existingInvite = Invites.findOne({ invitedUserEmail : userEmail });

      if (existingInvite) {
        throw new Meteor.Error(403, "Somebody has already invited this person.");
      }

      // create an invite
      // consider invite accepted if the invited person has an account already
      Invites.insert({
        invitingUserId: Meteor.userId(),
        invitedUserEmail: userEmail,
        token: invitation.token,
        role: invitation.role,
        accepted: typeof user !== "undefined"
      });

      // update invinting user
      Meteor.users.update(Meteor.userId(), {$inc:{"telescope.inviteCount": -1, "telescope.invitedCount": 1}});

      if(user){
        // update invited user
        Meteor.users.update(user._id, {
          $set: {
            "telescope.isInvited": true,
            "telescope.invitedBy": Meteor.userId(),
            "telescope.invitedByName": Users.getDisplayName(currentUser)
          }
        });
      }

      var communityName = Settings.get('title','Philly AIMS'),
          emailSubject = 'You are invited to '+communityName,
          emailProperties = {
            newUser : typeof user === 'undefined',
            communityName : communityName,
            actionLink : "/invite",//user ? Telescope.utils.getSigninUrl() : Telescope.utils.getSignupUrl(),
            invitedBy : Users.getDisplayName(currentUser),
            profileUrl : Users.getProfileUrl(currentUser),
            siteUrl: Settings.get("siteUrl"),
            userEmail : userEmail,
            token: invitation.token,
          };

      Meteor.setTimeout(function () {
        Telescope.email.buildAndSend(userEmail, emailSubject, 'emailInvite', emailProperties);
      }, 1);

    }

    return {
      newUser : typeof user === 'undefined'
    };
  },
  resend: function(email, role){
    var newToken = Random.hexString(16);

    Invites.update({invitedUserEmail: email}, 
      {$set: {token: newToken, 
        role: role, 
        date: new Date()}
      });

    var invitation = Invites.findOne({invitedUserEmail: email});
    var currentUser = Meteor.user();

    var communityName = Settings.get('title','Philly AIMS'),
          emailSubject = 'You are invited to the Philly AIMS Portal',
          emailProperties = {
            newUser : typeof user === 'undefined',
            communityName : communityName,
            actionLink : "/invite",//user ? Telescope.utils.getSigninUrl() : Telescope.utils.getSignupUrl(),
            invitedBy : Users.getDisplayName(currentUser),
            profileUrl : Users.getProfileUrl(currentUser),
            siteUrl: Settings.get("siteUrl"),
            userEmail : invitation.invitedUserEmail,
            token: invitation.token,
          };

      Meteor.setTimeout(function () {
        Telescope.email.buildAndSend(email, emailSubject, 'emailInvite', emailProperties);
      }, 1);
  },
  deleteInvite : function (email){
    Invites.remove({invitedUserEmail: email});
  },
  validateInviteLink : function(token, email){
    if(Invites.findOne({"token":token, "invitedUserEmail":email})){
      return true;
    } 
  },
  unInviteUser: function (userId) {
    Meteor.users.update(userId, {$set: {"telescope.isInvited": false}});
  }
});

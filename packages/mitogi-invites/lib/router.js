

FlowRouter.route( '/invite/:email/:token', {
  name: 'acceptInvite',
  action(params) {
    if(Meteor.userId()){
      FlowRouter.go("/");
    }
    else{
      Meteor.call('validateInviteLink', params.token, params.email, function (error, result){
        if(result){
          BlazeLayout.render( 'register' );
        }
        else{
          BlazeLayout.render( 'invalidInvite' );
        }
      });
    }
  }
});

FlowRouter.route( '/user/invite', {
  name: 'makeInvites',
  action(params) {
      BlazeLayout.render( "layout" , {main: 'user_invites' } );
  }
});


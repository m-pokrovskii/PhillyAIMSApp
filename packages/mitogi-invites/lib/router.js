

FlowRouter.route( '/invite/:email/:token', {
  name: 'acceptInvite',
  action(params) {
    if(Meteor.userId()){
      FlowRouter.go("/");
    }
    else{
      Meteor.call('validateInviteLink', params.token, params.email, function (error, result){
        if(result){
          BlazeLayout.render( "layout", {main: 'register'} );
          /*FlowRouter.go("/register/"+"?email="+
                              params.email+"&token="+params.token);*/
        }
        else{
          BlazeLayout.render( "layout" , {main: 'invalidInvite' } );
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


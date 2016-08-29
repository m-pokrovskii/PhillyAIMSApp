

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

FlowRouter.route( '/user/add', {
  name: 'addUsers',
  action(params) {
      BlazeLayout.render( "layout" , {main: 'make_user' } );
  }
});


FlowRouter.route( '/register/', {
  name: 'signUp',
  action(params) {
      if(!Settings.get("requireViewInvite"))
        BlazeLayout.render( "layout" , {main: 'register' } );
  }
});

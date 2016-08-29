 Meteor.methods({
  bulkMakeUser: function(data){

    check( data, Array );
    var error = new Array();
    var success = new Array();

    for ( let i = 0; i < data.length; i++ ) {
      let item   = data[ i ];
      try{
        var password = Random.id(5),
        username = item["First Name"]+item["Last Name"],
        email = item["Email"];
        Accounts.createUser({username: username, password : password, email: email });
        
        try{
          var communityName = Settings.get('title','Philly AIMS'),
              emailSubject = 'Access The Philly AIMS Portal',
              emailProperties = {
                username : username,
                password : password,
                em : password,
                changePwdUrl : FlowRouter.path("changePwd"),
                siteUrl: Settings.get("siteUrl"),
              };

          Meteor.setTimeout(function () {
            Telescope.email.buildAndSend(email, emailSubject, 'emailAdd', emailProperties);
          }, 1);
        }
        catch (exception){
        }
        success.push("Made account for "+ email);
      }
      catch (exception){
        error.push("Could not make account for "+email+". "+exception);
      }

      
    }//end for
    return {success: success, error: error};
  }
});
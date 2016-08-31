 Meteor.methods({
  bulkMakeUser: function(data){

    check( data, Array );
    var error = new Array();
    var success = new Array();

    for ( var i = 0; i < data.length; i++ ) {
      
          //Meteor.setTimeout(function () {
            try{
              var item   = data[ i ];
              console.log("item");
               console.log(item);
      
   
              var password = Random.id(5),
              username = item["First Name"]+item["Last Name"],
              email = item["Email"]+'';
              var result = Accounts.createUser({username: username, password : password, email: email });
              console.log("result: "+ result);
             if(Meteor.users.find({_id:result})){
                var myUsername = username+'';
                var myPassword= password+'';
                var myEmail= email+'';
                var communityName = Settings.get('title','Philly AIMS'),
                emailSubject = 'Access The Philly AIMS Portal';
                var emailProperties = {
                  username : myUsername,
                  password : myPassword,
                  //email : email,
                  changePwdUrl : FlowRouter.path("changePwd"),
                  siteUrl: Settings.get("siteUrl"),
                };
                console.log(emailProperties);
                Telescope.email.buildAndSend(myEmail, emailSubject, 'emailAdd', emailProperties);
                console.log(myUsername+" "+myPassword);
                success.push("Made account for "+ myEmail);
              }//end if
              else{
                error.push("Could not make account for "+email+". "+exception);
              }//end else
            }//end try
            catch (exception){
              error.push("Could not make account for "+email+". "+exception);
            }
        //}, 1);
          
          

      
    }//end for
    return {success: success, error: error};
  }
});
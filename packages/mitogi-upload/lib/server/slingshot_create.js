
Slingshot.createDirective( "uploadToAmazonS3", Slingshot.S3Storage, {
  bucket: Meteor.call('getBucket'),
  acl: "public-read",
  authorize: function () {
   /* let userFileCount = Files.find( { "userId": this.userId } ).count();
    return userFileCount < 3 ? true : false;*/
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },
  key: function ( file , metaContext) {
    /*var pathname = '';
    if(file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|)$/)){
      pathname = "images/"
    }
    else if(file.name.toLowerCase().match(/\.(avi|mpeg|mp4|mov|wav)$/)){
      pathname = "videos/"
    }
    else{
      pathname = "uploads/"
    }*/
    var user = Meteor.users.findOne( this.userId );
    return metaContext.type+"/" + metaContext.mini_key+file.name;
  }
});
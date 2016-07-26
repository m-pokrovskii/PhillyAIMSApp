Meteor.methods({
  vimeo_token : function(){
    return Meteor.settings.private.VIMEO_TOKEN;
  },
  'deleteFile': function(name, subdir) {
      check(name, String);
      subdir = subdir ? subdir + "/" : '';
      var filepath = process.env.PWD + '/.uploads/' + subdir + name;
      UploadServer.delete(name);
  }
});
AutoForm.addInputType("avatarUpload", {
  template: "afAvatarUpload",
  isHidden: false,
  valueOut: function () {
    //saves fileID
    return this.val();
  }
});

function deleteSingle(oldFile){
  if(oldFile){
      Meteor.call("deleteS3File", oldFile._id);
  }
}
//template level subscription
Template['afAvatarUpload'].onCreated(function (){
  var self = this;
  self.uploadFile = new ReactiveVar(this.data.value);
  console.log("values "+self.data.value);
  self.autorun(function () {
    var subscription = Telescope.subsManager.subscribe('filesByURL', self.data.value);
    if (subscription.ready()) {
      self.uploadFile.set(Files.findOne({filepath:self.data.value}));
    }
  });
 });


Template.afAvatarUpload.helpers({
  callback: function() {
    var template = Template.instance();
    return {finished: function(data){
        console.log("callback");
        deleteSingle(template.uploadFile.get());
        template.uploadFile.set(data);
      }
    }
  },
  uploadFile: function(){
    return Template.instance().uploadFile.get();
  },
  user: function(){
    return Meteor.user();
  }
})

Template['afAvatarUpload'].events({
  'click .delete-file':function(event, template) {
    if (confirm('Are you sure?')) {
      deleteSingle(template.uploadFile.get());
      template.uploadFile.set();
    }
  }
})
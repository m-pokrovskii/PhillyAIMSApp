AutoForm.addInputType("imageUpload", {
  template: "afImageUpload",
  isHidden: false,
  valueOut: function () {
    alert(this.val());
    return this.val();
  }
});

//template level subscription
Template['afImageUpload'].onCreated(function (){
  this.uploadFile = new ReactiveVar(this.data.value);
 });


Template.afImageUpload.helpers({
  myCallbacks: function(data) {
    Template.instance().uploadFile.set(data.url);
  },
  uploadFile: function(){
    return Template.instance().uploadFile.get();
  },
  resourceID: function(){
    return Session.get("resourceID");
  }
})

Template['afImageUpload'].events({
  'click .delete-file':function(event, template) {
    if (confirm('Are you sure?')) {
      //Meteor.call('deleteFile', template.uploadFile.get());
      //need to get the substring to delete
      template.uploadFile.set();
    }
  }
})
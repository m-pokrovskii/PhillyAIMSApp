AutoForm.addInputType("imageUpload", {
  template: "afImageUpload",
  isHidden: false,
  valueOut: function () {
    //saves fileID
    return this.val();
  }
});

function deleteSingle(fileId){
    console.log(fileId);
    Meteor.call("deleteS3File", fileId);
}

//template level subscription
Template['afImageUpload'].onCreated(function (){
  var self = this;
  this.ready = new ReactiveVar();
  this.settings = this.data.atts.settings || {};
  self.uploadFile = new ReactiveVar();
  self.url = new ReactiveVar(this.data.value);

  console.log("values "+self.data.value);
  self.autorun(function () {
    var subscription = Telescope.subsManager.subscribe('filesByURL', self.url);
    if (subscription.ready()) {
      self.uploadFile.set(Files.findOne({filepath: self.url}));
      self.ready.set(true);
    }
  });
 });


Template.afImageUpload.helpers({
  ready: function(){
    return Template.instance().ready.get();
  },
  callback: function() {
    var template = Template.instance();
    return {finished: function(data){
        //console.log("data!!");
        //console.log(data);
        if(template.uploadFile.get()){
          deleteSingle(template.uploadFile.get()._id);
        }
        template.uploadFile.set(data);
        //template.url.set(template.uploadFile.get().filepath);
        //Telescope.subsManager.subscribe('filesByURL', template.url.get());
      }
    }
  },
  avatar: function(){
    return Template.instance().settings.avatar;
  },
  uploadFile: function(){
    //console.log(Template.instance().uploadFile.get());
    return Template.instance().uploadFile.get();
  },
  user: function(){
    return Meteor.user();
  }
})

Template['afImageUpload'].events({
  'click .delete-file':function(event, template) {
    event.preventDefault();
    console.log(template.uploadFile.get());
    if (confirm('Are you sure?')) {
      var targetId = template.uploadFile.get()._id;
      deleteSingle(targetId);
      template.uploadFile.set();
    }
  }
})
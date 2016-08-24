AutoForm.addInputType("imageUpload", {
  template: "afImageUpload",
  isHidden: false,
  valueOut: function () {
    //saves fileID
    return this.val();
  }
});

function deleteSingle(fileId){
    Meteor.call("deleteS3File", fileId);
}

//template level subscription
Template['afImageUpload'].onCreated(function (){
  
  this.ready = new ReactiveVar();
  this.uploadFile = new ReactiveVar();
  this.settings = this.data.atts.settings; //|| {};
  //console.log(this.settings);

  var self = this;

  self.autorun(function () {
    var subscription = Telescope.subsManager.subscribe('filesByURL', self.data.value);
    if (subscription.ready()) {
      var myFile = Files.findOne({filepath: self.data.value});
      if(myFile)
        self.uploadFile.set(myFile);
      self.ready.set(true);
    }
  });
 });


Template.afImageUpload.helpers({
  ready: function(){
    return Template.instance().ready.get();
  },
  resizeTh : function(){
    let s = Template.instance().settings;
    if(s=="thumbnail"){
      return {width:600, height: 300, cropSquare:false};//var resize = {width: s.width, height: s.height, cropSquare: s.cropSquare};
    }
    else if(s=="avatar"){
      return {width:75, height: 75, cropSquare:true};//var resize = {width: s.width, height: s.height, cropSquare: s.cropSquare};
    }
    //return Template.instance().settings.resize;
    //return {width:200, height:175, cropSquare: true};
  },
  myCallback: function() {
    var template = Template.instance();
    return {finished: function(data){
        if(template.uploadFile.get()){
          deleteSingle(template.uploadFile.get()._id);
        }
        template.uploadFile.set(data);
        template.url.set(template.uploadFile.get().filepath);
      }
    }
  },
  avatar: function(){
    if(Template.instance().settings=="avatar")
    return Template.instance().settings=="avatar";//Template.instance().settings.avatar;
  },
  uploadFile: function(){
    return Template.instance().uploadFile.get();
  }
})

Template['afImageUpload'].events({
  'click .delete-file':function(event, template) {
    event.preventDefault();
    if (confirm('Are you sure?')) {
      var targetId = template.uploadFile.get()._id;
      deleteSingle(targetId);
      template.uploadFile.set();
    }
  }
})
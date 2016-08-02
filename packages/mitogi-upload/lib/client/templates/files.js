Template.registerHelper( 'numberWithCommas', ( string ) => {
    var x = Math.floor(parseInt(string)/1000);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

Template.files.onCreated( function () {
  var self = this;
  this.ready = new ReactiveVar(false);
  this.filesArray = new ReactiveVar();
  self.autorun(function () {

    var subscription = Telescope.subsManager.subscribe( 'myFiles' , self.data.resourceID , self.data.type);

    if (subscription.ready()) {

        var files = Files.find( {resourceID: self.data.resourceID, type: self.data.type}, { sort: { "order": 1, "added": -1 } } );
        self.filesArray.set(files);
        self.ready.set(true);
    }
  });
  	
  	//this.subscribe( 'files' ) ;
});

Template.files.helpers({
  ready: function() {
    return Template.instance().ready.get();
  },
  files: function() {
      return Template.instance().filesArray.get();
  },
  templateName : function(){
  	return "file-"+Template.instance().data.type;
  }
});

Template['video_player'].helpers({
  notwebm: function(filepath) {
    return !filepath.endsWith(".webm");
  },
  endsWith: function(filepath) {
    return filepath.split(".").slice(-1)[0];
  },
  newExtension: function(filepath, ext) {
    return filepath.slice(0,-(filepath.split(".").slice(-1)[0].length))+ext;
  },
  getPlayer: function(url){

    if(url.indexOf("vimeo.com") > -1){
      var id = url.split(/[\=\/]+/).slice(-1)[0];
      return "https://player.vimeo.com/video/"+id;
    }

    else if(url.indexOf("youtube.com") > -1 || url.indexOf("youtu.be") > -1){
      var id = url.replace(/http:|https:|www.|youtube.com|watch\?v=|youtu.be|\//g,'');
      return "https://www.youtube.com/embed/"+id;
    }
    return false;
  },
});

/*Template['file-attachment'].events({


  'blur input[name="filename"]': function (event, template) {
    event.preventDefault();
    var targetId = event.target.getAttribute("data-id");
    //var name = template.find("input[name='filename' data-id="+targetId+"]");
    //var order = template.find("input[name='order' data-id="+targetId+"]");
    var name = event.target.value;
    console.log(name);
    Meteor.call("setFileName" ,targetId, name);
    //template.uploadAttach.list()[targetIndex].name = event.target.text.value;

  },

  'blur input[name="order"]': function (event, template) {
    event.preventDefault();
    var targetId = event.target.getAttribute("data-id");
    //var name = template.find("input[name='filename' data-id="+targetId+"]");
    //var order = template.find("input[name='order' data-id="+targetId+"]");
    var order = event.target.value;
    console.log(order);
    Meteor.call("setFileOrder" ,targetId, order);
    //template.uploadAttach.list()[targetIndex].name = event.target.text.value;

  },
  
  'click .delete-file': function (event, template) {
    event.preventDefault();
    if (confirm('Are you sure?')) {
      FileViewController.deleteFile(event);
    }
  }
});

Template['file-photo'].events({
  'blur input[name="filename"]': function (event, template) {
    event.preventDefault();
    var targetId = event.target.getAttribute("data-id");
    //var name = template.find("input[name='filename' data-id="+targetId+"]");
    //var order = template.find("input[name='order' data-id="+targetId+"]");
    var name = event.target.value;
    console.log(name);
    Meteor.call("setFileName" ,targetId, name);
    //template.uploadAttach.list()[targetIndex].name = event.target.text.value;

  },

  'blur input[name="order"]': function (event, template) {
    event.preventDefault();
    var targetId = event.target.getAttribute("data-id");
    //var name = template.find("input[name='filename' data-id="+targetId+"]");
    //var order = template.find("input[name='order' data-id="+targetId+"]");
    var order = event.target.value;
    console.log(order);
    Meteor.call("setFileOrder" ,targetId, order);
    //template.uploadAttach.list()[targetIndex].name = event.target.text.value;

  },
  'click .delete-file': function (event, template) {
    event.preventDefault();
    if (confirm('Are you sure?')) {
      FileViewController.deleteFile(event);
    }
  }
});*/

Template['metadata_files_form'].events({
  'blur input[name="filename"]': function (event, template) {
    event.preventDefault();
    var targetId = event.target.getAttribute("data-id");
    //var name = template.find("input[name='filename' data-id="+targetId+"]");
    //var order = template.find("input[name='order' data-id="+targetId+"]");
    var name = event.target.value;
    console.log(name);
    Meteor.call("setFileName" ,targetId, name);
    //template.uploadAttach.list()[targetIndex].name = event.target.text.value;

  },

  'blur input[name="order"]': function (event, template) {
    event.preventDefault();
    var targetId = event.target.getAttribute("data-id");
    //var name = template.find("input[name='filename' data-id="+targetId+"]");
    //var order = template.find("input[name='order' data-id="+targetId+"]");
    var order = event.target.value;
    console.log(order);
    Meteor.call("setFileOrder" ,targetId, order);
    //template.uploadAttach.list()[targetIndex].name = event.target.text.value;

  },
  'click .delete-file': function (event, template) {
    event.preventDefault();
    if (confirm('Are you sure?')) {
      FileViewController.deleteFile(event);
    }
  }
});

Template['video_player'].onCreated(function(){
  this.ready = new ReactiveVar(false);
  var self = this;

  /*this.autorun(function () {
    if(!self.ready.get()){
      
       var check = HTTP.call("HEAD", fileCheck, null, function(error, result){
        if (error) {
          console.log(error);
        }
        else if(result){
          console.log(result);
          self.ready.set(true);
        }
      })
    }
  });*/
  var filepath = self.data.video.filepath;
  var breakIndex = filepath.lastIndexOf(".");
  var shortKey = filepath.substring(0, breakIndex);
  var fileCheck = shortKey+".mp4"


  self.check = function(){
    try{
      HTTP.call("HEAD", fileCheck, null, function(error, result){

          if (error) {
            console.log(error);
          }
          else if(result){
            clearInterval(self.interval);
            self.ready.set(true);
          }
      });
    }
    catch(exception){
    }
  }
  this.check();
  this.interval = setInterval(this.check, 2000);
});

Template['video_player'].helpers({
  ready: function(){
    return Template.instance().ready.get();
  }
});

function endsWith(filepath, array){
  var answer = false;
  for(var i=0; i< array.length; i++){
    if(filepath.toLowerCase().endsWith(array[i])){
      answer = true;
      break;
    }
  }
  return answer;
}

Template['file-attachment'].helpers({
  getIcon: function (filepath) {
    if(endsWith(filepath,[".doc",".docx"])){
      return "fa-file-word-o text-primary";
    }
    else if(endsWith(filepath,[".pdf"])){
      return "fa-file-pdf-o text-danger";
    }
    else if(endsWith(filepath,[".xls",".xlsx"])){
      return "fa-file-excel-o text-success";
    }
    else if(endsWith(filepath,[".ppt",".pptx"])){
      return "fa-file-powerpoint-o text-danger";
    }
    else if(endsWith(filepath,[".jpg",".jpeg",".bmp",".png",".gif",".tif"])){
      return "fa-file-image-o text-success";
    }
    else if(endsWith(filepath,[".txt"])){
      return "fa-file-text-o text-success";
    }
    else if(endsWith(filepath,[".zip"])){
      return "fa-file-archive-o text-warning";
    }
    else if(endsWith(filepath,[".webm",".mp4",".avi",".mov",".wmv",".mng",".mpeg",".m4v"])){
      return "fa-file-video-o text-primary";
    }
    else{
      return "fa-file-o text-primary";
    }
  }
});

FileViewController = {
  deleteFile : function(event){
    var id = event.target.getAttribute("data-id");
    Meteor.call('deleteS3File', id, null, function(error, result) {
        if(!error){
            //Session.set('submitSpotlight', true);
        }
        else{
          console.log(error);
        }
      });
  },
  updateMetadata : function(event){
    var id = event.target.getAttribute("data-id");
    Meteor.call('updateMetadata', id, null, function(error, result) {
        if(!error){
            //Session.set('submitSpotlight', true);
        }
        else{
          console.log(error);
        }
      });
  }
}
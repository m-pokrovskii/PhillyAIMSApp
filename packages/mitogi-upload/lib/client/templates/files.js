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

        var files = Files.find( {resourceID: self.data.resourceID, type: self.data.type}, { sort: { "order": 1, "added": 1 } } );
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
    Meteor.call("setFileName" ,targetId, name);
    //template.uploadAttach.list()[targetIndex].name = event.target.text.value;

  },

  'blur textarea[name="desc"]': function (event, template) {
    event.preventDefault();
    var targetId = event.target.getAttribute("data-id");
    //var name = template.find("input[name='filename' data-id="+targetId+"]");
    //var order = template.find("input[name='order' data-id="+targetId+"]");
    var desc = event.target.value;
    Meteor.call("setFileDesc" ,targetId, desc);
    //template.uploadAttach.list()[targetIndex].name = event.target.text.value;

  },

  'blur input[name="order"]': function (event, template) {
    event.preventDefault();
    var targetId = event.target.getAttribute("data-id");
    //var name = template.find("input[name='filename' data-id="+targetId+"]");
    //var order = template.find("input[name='order' data-id="+targetId+"]");
    var order = event.target.value;
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

/*Template['video_player'].onCreated(function(){
  this.ready = new ReactiveVar(false);

});

Template['video_player'].onRendered(function(){ 
  var self = this;
  var filepath = self.data.video.filepath;
  var breakIndex = filepath.lastIndexOf(".");
  var shortKey = filepath.substring(0, breakIndex);
  var fileCheck = shortKey+".mp4"

  if(self.data.video.key){

    self.check = function(){
      try{
        /*HTTP.call("HEAD", fileCheck, null, function(error, result){

            //if (error) {
            //  console.log(error);
           // }
            if(result){
              console.log("hit here");
              clearInterval(self.interval);
              self.ready.set(true);
            }
            else if(error){
              self.ready.set(false);
            }
        });*/
          //function doesFileExist(urlToFile)
          //{
              /*var xhr = new XMLHttpRequest();
              xhr.open('HEAD', fileCheck, true);
              xhr.send();
               
              if (xhr.status == "404") {
                  return false;
              } else {
                  clearInterval(self.interval);
                  self.ready.set(true);
              }

              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', fileCheck, true);
              xhr.onload = function (e) {
                /*if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                    console.log(xhr.responseText);
                  } else {
                    console.error(xhr.statusText);
                  }
                }
                clearInterval(self.interval);
                  self.ready.set(true);
              };
              xhr.onerror = function (e) {
                //console.error(xhr.statusText);
              };
              xhr.send(null);
          //}
      }
      catch(exception){
      }
    }
    self.check();
    self.interval = setInterval(self.check, 2000);
  }else{
    self.ready.set(true);
    console.log("hit there");
  }
});

Template['video_player'].helpers({
  ready: function(){
    return Template.instance().ready.get();
  }
});*/

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
  isPdf: function(filepath){
    return false;//endsWith(filepath,[".pdf"]);
  },
  getPdfThumbnail: function(filepath, imageId){
    //else if(endsWith(filepath,[".pdf"])){
      /*Thumbnails.pdf($("#th-"+imageId),filepath,{
        width: 200,
        page: 1
      });
      //return "fa-file-pdf-o text-danger";*/
    //}
  },
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
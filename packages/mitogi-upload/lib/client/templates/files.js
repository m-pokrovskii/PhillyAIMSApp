Template.registerHelper( 'numberWithCommas', ( string ) => {
    var x = Math.floor(parseInt(string)/1000);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

Template.files.onRendered( function () {
  var self = this;
  console.log(this.data.resourceID +" "+this.data.type );

  	this.subscribe( 'myFiles' , this.data.resourceID , this.data.type);
  	//this.subscribe( 'files' ) ;
});

Template.files.helpers({
  files: function() {
    var files = Files.find( {type: Template.instance().data.type}, { sort: { "added": -1 } } );
    if ( files ) {
      return files;
    }
  },
  templateName : function(){
    console.log(Template.instance().type);
    console.log(Template.instance().data.type);
  	return "file-"+Template.instance().data.type;
  }
});

Template['file-video'].helpers({
  notwebm: function(filepath) {
    return !filepath.endsWith(".webm");
  },
  edit: function(){
    return Template.instance().data.edit;
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

Template['file-attachment'].events({
 /* 'change .name-attach': function (event, template) {
    event.preventDefault();
    var targetIndex = event.target.getAttribute("data-index");
    template.uploadAttach.list()[targetIndex].name = event.target.text.value;
  },*/
  'click .delete-file': function (event, template) {
    event.preventDefault();
    if (confirm('Are you sure?')) {
      FileViewController.deleteFile(event);
    }
  }
});

Template['file-photo'].events({
  'click .delete-file': function (event, template) {
    event.preventDefault();
    if (confirm('Are you sure?')) {
      FileViewController.deleteFile(event);
    }
  }
});

Template['file-video'].events({
  'click .delete-file': function (event, template) {
    event.preventDefault();
    if (confirm('Are you sure?')) {
      FileViewController.deleteFile(event);
    }
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
    console.log(id);
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
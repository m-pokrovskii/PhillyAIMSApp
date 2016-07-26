//AutoForm.setDefaultTemplateForType('afArrayField', 'no_array');

/*AutoForm.addInputType("attachment", {
  template: "AttachmentUpload",
  isHidden: false,
  valueOut: function () {

    alert([{filepath:'gpooo', name: 'dfjlkd'}]);
   return new Array().push({filepath:'gpooo', name: 'dfjlkd'});//result;
  }
});

*/
Template.AttachmentUpload.onCreated(function(){
  this.uploadAttach = this.data.spotlightData.attachment; // new ReactiveArray([]);
});



Template.AttachmentUpload.helpers({
  attachCallback: function () {
    var template = Template.instance();
    return {
        finished: function(index, fileInfo, context) {
          var myIndex = template.uploadAttach.list().length;
          template.uploadAttach.push({filepath: fileInfo.url, 
            size: fileInfo.size, 
            name: fileInfo.name, index: myIndex} ); //_id: _id 
          Session.set('submitSpotlight', true);
        },
    }
  },
  filesToUpload: function() {
    return Template.instance().uploadAttach.list();
  },
  editMode: function() {
    return true;
  }
});


Template.AttachmentUpload.events({
  'change .name-attach': function (event, template) {
    event.preventDefault();
    var targetIndex = event.target.getAttribute("data-index");
    template.uploadAttach.list()[targetIndex].name = event.target.text.value;
    alert("wtf");
  },
  'click .deleteUpload': function (event, template) {
    event.preventDefault();
    if (confirm('Are you sure?')) {
      var targetIndex = event.target.getAttribute("data-index");
      var filename = template.uploadAttach.list()[targetIndex].name;
   
      Meteor.call('deleteFile', filename, null, function(error, result) {
        if(!error){
            template.uploadAttach.splice(targetIndex, 1);
            Session.set('submitSpotlight', true);
        }
        else{
          console.log(error);
        }
      });
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

Template.attachmentInfo.helpers({
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


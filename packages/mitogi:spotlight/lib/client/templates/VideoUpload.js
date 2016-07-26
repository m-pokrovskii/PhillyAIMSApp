vimeoInsert = function(file, template){
  var results = document.getElementById('results')
  /* Clear the results div */
  while (results.hasChildNodes()) results.removeChild(results.firstChild)

  var name  = document.getElementById('videoName').value
  var description = document.getElementById('videoDescription').value;

  var progressBar = {
    
    /**
     * Updat progress bar.
     */
    updateProgress: function (progress) {
        progress = Math.floor(progress * 100)
        var element = document.getElementById('progress')
        element.setAttribute('style', 'width:' + progress + '%')
        element.innerHTML = '&nbsp;' + progress + '%'
    },

    /* local function: show a user message */
    showMessage: function (html, type) {
            /* hide progress bar */
            document.getElementById('progress-container').style.display = 'none'

            /* display alert message */
            var element = document.createElement('div')
            element.setAttribute('class', 'alert alert-' + (type || 'success'))
            element.innerHTML = html
            results.appendChild(element)
    }
  }

  /* Rest the progress bar and show it */
  progressBar.updateProgress(0);
  document.getElementById('progress-container').style.display = 'block';

  Meteor.call('vimeo_token', function (error, result){
    console.log(error);
    console.log(result);
    console.log("------");
  (new template.VimeoUpload({
                name: name,
                description: description,
                private: false, //set privacy
                file: file,
                token: "762f0e636466ba0d20cc777d1e7fe2d9", //not cool!!!
                upgrade_to_1080: false,
                onError: function(data) {
                    progressBar.showMessage('<strong>Error</strong>: ' + JSON.parse(data).error, 'danger');
                    console.log('<strong>Error</strong>: ' + JSON.parse(data).error, 'danger');
                },
                onProgress: function(data) {
                    Session.set('unsavedChanges', true);
                    progressBar.updateProgress(data.loaded / data.total)
                },
                onComplete: function(videoId, index) {
                    var url = 'https://vimeo.com/' + videoId

                    if (index > -1) {

                        /* The metadata contains all of the uploaded video(s) details see: https://developer.vimeo.com/api/endpoints/videos#/{video_id} */
                        url = this.metadata[index].link //

                        /* add stringify the json object for displaying in a text area */
                        var pretty = JSON.stringify(this.metadata[index], null, 2)

                        console.log(pretty) /* echo server data */
                    }
                    Session.set('submitSpotlight', true);
                    Session.set('unsavedChanges', false);

                    template.uploadVid.push({filepath: url,
                      name: name, _id: videoId, index: index,
                      description: description });
                    console.log(template.uploadVid.array());
                  

                    progressBar.showMessage('<strong>Upload Successful</strong>: check uploaded video @ <a href="' + url + '">' + url + '</a>.')
                }
            })).upload();
    });
}

//template level subscription
Template.VideoUpload.onCreated(function (){
  this.uploadOption = new ReactiveVar(undefined);
  this.uploadDocs = new ReactiveVar(false);
  //this.uploadVid = new ReactiveArray();
  this.uploadVid = this.data.spotlightData.video;
  createVimeo(this);
});

Template.VideoUpload.onRendered(function (){
  
});

//helper
Template.videoInfo.helpers({
  getPlayer: function(id, url){

    if(url.indexOf("vimeo.com") > -1){
      return "https://player.vimeo.com/video/"+id;
    }

    else if(url.indexOf("youtube.com") > -1 || url.indexOf("youtu.be") > -1){
      return "https://www.youtube.com/embed/video/"+id;
    }
    return url;
  },
});

Template.VideoUpload.helpers({
  uploadOption : function(){
        return Template.instance().uploadOption.get();
  },
  filesToUpload: function() {
    return Template.instance().uploadVid.list();
  },
  editMode: function(){
    return true;
  },
  opts: function() {
    var template= Template.instance();
    var opts ={
      maxTime: 15*60, 
      // androidQuality: 0, 
      // videoDisplay: { 
      //   width: 600, 
      //   height: 460 
      // }, 
      // classes: { 
      //   recordBtn: 'video-capture-basic-record-btn', 
      //   stopBtn: 'video-capture-basic-stop-btn' 
      // }, 
      onVideoRecorded: function(err, base64Data, blobFile) {
        if(Meteor.isCordova){
          blobFile = base64Data;
        }
        vimeoInsert(base64Data, template);
      }
    };
    return opts;
  }
});

Template.VideoUpload.events({
  'click .js-makeBtn' : function(evt){
      Template.instance().uploadOption.set('make');
      console.log(Template.instance().uploadOption.get());
  },
  'click .js-cancelBtn' : function(evt){
      Template.instance().uploadOption.set(false);
  },
  'click .js-uploadBtn' : function(evt){
      Template.instance().uploadOption.set('upload');
      console.log(Template.instance().uploadOption.get());
  },
  'click .js-saveBtn' : function(evt){
      
  },
  'change .myFileInput': function handleFileSelect(evt, template) {
            evt.stopPropagation()
            evt.preventDefault()
            var files = evt.dataTransfer ? evt.dataTransfer.files : evt.target.files;//$(this).get(0).files 
            var file = files[0];
            
            vimeoInsert(file, template);

        },
})
Template.video_capture.onCreated(function(){
  this.myUploader = new MyUploader();
  this.onUpload = new ReactiveVar();
  this.myUploader.init(this);

  this.getVideoSource = new ReactiveVar();

  this.savedVideo = new ReactiveVar(false);
});

Template.video_capture.helpers({
  isUploading: function () {
	return Boolean(Template.instance().onUpload.get());
  },
  progress: function() {
  	if(Template.instance().onUpload.get())
    return Math.round(Template.instance().onUpload.get().progress() * 100);
  },
  savedVideo: function(){
  	return Template.instance().savedVideo.get();
  },
  opts: function() {
  	  var template = Template.instance();
      var opts ={
         maxTime: 15 * 60,
         androidQuality: 0,
         videoDisplay: {
           width: 600*1.5,
           height: 460*1.5,
         },
        // classes: {
        //   recordBtn: 'video-capture-basic-record-btn',
        //   stopBtn: 'video-capture-basic-stop-btn'
        // },
        onVideoRecorded: function(err, base64Data) {
          console.log('onVideoRecorded');
          template.getVideoSource.set(base64Data);
          template.savedVideo.set(true);
        }
      };
      return opts;
    }
});

Template.video_capture.events({
   'click .upload-camera-video': function(e, template){
	    e.preventDefault();
	    Template.instance().savedVideo.set(false);
	    var base64Data = template.getVideoSource.get();
	    template.myUploader.upload( { base64: base64Data});
   }
});
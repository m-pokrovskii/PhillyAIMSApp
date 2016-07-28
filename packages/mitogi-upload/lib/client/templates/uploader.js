Template.uploader.onCreated(function(){
  let callback = this.data.callback;
  console.log("mckmd"+this.data.type);
  this.myUploader = new MyUploader();

  this.onUpload = new ReactiveVar();
  this.filename = new ReactiveVar();

  this.myUploader.init(this, callback, this.data.type);
  this.getURL = new ReactiveVar(false);
  this.getVideoSource = new ReactiveVar();
  this.enableURL = new ReactiveVar(false);
  this.savedVideo = new ReactiveVar(false);
  this.videoCapture = new ReactiveVar(false);
});

Template.uploader.helpers({
  isUploading: function () {
	return Boolean(Template.instance().onUpload.get());
  },
  progress: function() {
  	if(Template.instance().onUpload.get())
    return Math.round(Template.instance().onUpload.get().progress() * 100);
  },
  filename: function() {
  	if(Template.instance().onUpload.get())
    return Math.round(Template.instance().filename.get());
  },
  getURL : function(){
  	return Template.instance().getURL.get();
  },
  enableURLButton : function(){
  	return Template.instance().enableURL.get() ? '' : "disabled";
  },
  notEquals : function(item1, item2){
  	return item1 !== item2;
  },
  videoCapture: function(){
  	return Template.instance().videoCapture.get();
  },
  savedVideo: function(){
  	return Template.instance().savedVideo.get();
  },
  urlPlaceholder: function(){
  	if(Template.instance().data.type)
  		return "www.image.com/image.jpg";
  	else{
  		return "youtube.com/7dom7zCvGC8 or vimeo.com/176508773"
  	}
  },
  opts: function() {
  	  var template = Template.instance();
      var opts ={
        // maxTime: 15,
        // androidQuality: 0,
        // videoDisplay: {
        //   width: 600,
        //   height: 460
        // },
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



Template.uploader.events({
  'change input[type="file"]' ( event, template ) {
  		event.preventDefault();
  		console.log("fielchange "+template.data.type);
    	template.myUploader.upload( { event: event});
  },
  'click .camera-photo': function(e, template){
	    e.preventDefault();
	    MeteorCamera.getPicture({}, function(e,data){
	    	template.myUploader.upload( { base64: data});
          
	    });
	},
   'click .camera-video': function(e, template){
	    e.preventDefault();
	    Template.instance().videoCapture.set(true);
	},
   'click .upload-camera-video': function(e, template){
	    e.preventDefault();
	    Template.instance().savedVideo.set(false);
	    var base64Data = template.getVideoSource.get();
	    template.myUploader.upload( { base64: base64Data});
   },
  'click .urlPicture': function(e, template){
  		console.log(template.getURL.get());
	    template.getURL.set(true);
  },
  'change input:text[name=urlInput]': function(e, template){
  	  	template.enableURL.set(e.target.value);

  },
  'click .urlSubmit': function(e, template){
	    e.preventDefault();
	    //console.log(e.target.value);
	    //var element = template.find('input:text[name=urlInput]');
    	var fileUrl = template.enableURL.get();
    	console.log("mom"+template.data.type);
    	if(fileUrl){
	    	if(template.data.type==="photo"){
			    //element.val();
			    
			    var mytemp = template;
			    var callme = function( error, response ) {
				  // Handle the error or response here.
			  		if(error){
			  			console.log(error);
			  			Bert.alert("This isn't a valid image url", "danger", "growl-top-right");
			  		}
			  		else{
			  			 Bert.alert( "Image successfully saved.", "success", "growl-top-right" );
						 template.myUploader.upload( { base64: response
						 });
			  		}
				};
				Meteor.call('urlCall', fileUrl, callme);
			}

			else if(template.data.type === "video"){
				//var file = event.target.files[0];

				if(url.indexOf("vimeo.com") > -1 || url.indexOf("youtube.com") > -1){

				
					console.log("video url upload");
					var data = {
						url : fileUrl,
						name : "Default Name",
						size : null,
						type: "video",
						key: null,
						id: template.data.resourceID
					}
					Meteor.call( "insertFiles", data, null, function ( error ) {
					    if ( error ) {
					      Bert.alert( error.reason, "warning" );
					    } else {
					      Bert.alert( "Video successfully saved.", "success" , "growl-top-right");
					      //if(callback) callback(data);
					    }
					});
				}
				else{
					Bert.alert("Links need to be youtube or vimeo.", "danger", "growl-top-right");
				}
			}
		}

		
	}
});

MyUploader = function() {
	return{
		template: null,
		uploader: null,
		callback: null,
		type: null,
		_getFileFromInput: function ( event ) {
			return event.target.files[0];
		},
		_setPlaceholderText: function( string = "Click or Drag a File Here to Upload" ) {
		  console.log(this.template);
		  this.template.find( "span.placeholder" ).innerText = string;
		},
		//give either event or file and template
		//give callback
		init : function(template, callback, type){
			this.template = template;
			this.callback = callback;
			this.type = type;

			return this;
		},
		upload : function( options ) {
		  var file = null;
		  if(options.event){
		  	file = this._getFileFromInput( options.event );
		  }
		  else{
		  	let contentType = this._getContentType(options.base64);

		  	let blob = this._dataURItoBlob(options.base64, contentType);
		    let name = new Date().toString()+"."+contentType.split("/")[1];

		    console.log(name);
		    
		  	file = this._blobToFile(blob, name);
		  }

		  this._setPlaceholderText( `Uploading ${file.name}...` );
		  this._uploadFileToAmazon( file , options);
		},
		_getContentType : function(base64){
			return base64.split(":")[1].split(";")[0];
		},
		_uploadFileToAmazon :function ( file , options) {
		  var bucket = this.type==="video" ? "uploadToVideoBucket" : "uploadToAmazonS3" ;
		  var metaContext = {mini_key: Random.id(5)+"_"};
		  this.uploader = new Slingshot.Upload( "uploadToAmazonS3", metaContext);

		  this.template.filename.set(file.name);
		  this.template.onUpload.set(this.uploader);

		  var self = this;
		  this.uploader.send( file, function( error, url ){
		  	//self.template.onUpload.set();
		    if ( error ) {
		      Bert.alert( error.message, "warning" );
		      self._setPlaceholderText();
		    } else {
		      console.log("there "+this.type);
		      self._addUrlToDatabase( url , file, metaContext);
		    }
		  });
		},
		_addUrlToDatabase : function( url , file, metaContext) {
			console.log("here "+this.type);
			var data = {
				url : url,
				name : metaContext.mini_key+file.name,
				size : file.size,
				type: this.type,//this.template.data.type,
				id: this.template.data.resourceID
			}
			console.log(metaContext.mini_key+file.name);
		  var self = this;
		  Meteor.call( "storeUrlInDatabase", data, function ( error ) {
		    if ( error ) {
		      Bert.alert( error.reason, "warning" );
		      self._setPlaceholderText();
		    } else {
		      Bert.alert( "File uploaded to Amazon S3!", "success" );
		      self._setPlaceholderText();

		      
		      if(self.callback) self.callback(data);
		    }
		  });
		},
		_dataURItoBlob: function (dataURI, contentType) {
		    var binary = atob(dataURI.split(',')[1]);
		    var array = [];
		    for(var i = 0; i < binary.length; i++) {
		        array.push(binary.charCodeAt(i));
		    }
		    return new Blob([new Uint8Array(array)], {type: contentType});
		},
		_blobToFile: function(theBlob, fileName){
		    //A Blob() is almost a File() - it's just missing the two properties below which we will add
		    theBlob.lastModifiedDate = new Date();
		    theBlob.name = fileName;
		    return theBlob;

		}
	}
}
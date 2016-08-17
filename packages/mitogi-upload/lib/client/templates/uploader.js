Template.uploader.onCreated(function(){
  this.myUploader = new MyUploader();

  this.onUpload = new ReactiveVar();
  this.filename = new ReactiveVar();

  this.myUploader.init(this);
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
  videoCapture: function(){
  	return Template.instance().videoCapture.get();
  },
  savedVideo: function(){
  	return Template.instance().savedVideo.get();
  },
  urlPlaceholder: function(){
  	if(Template.instance().data.type==="photo"){
  		return "www.image.com/image.jpg";
  	}
  	else{
  		return "youtube.com/7dom7zCvGC8 or vimeo.com/176508773";
  	}
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



Template.uploader.events({
  'change input[type="file"]' ( event, template ) {
  		event.preventDefault();
  		if(event.target.files[0]){
    		template.myUploader.upload( { event: event});
    	}
  },
  'click .camera-photo': function(e, template){
	    e.preventDefault();
	    MeteorCamera.getPicture({}, function(e,data){
	    	template.myUploader.upload( { base64: data});
          
	    });
	},
   'click .notUrl': function(e, template){
   		template.getURL.set(false);
   },
   'click .notVideoCapture': function(e, template){
   		template.videoCapture.set(false);
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
	    template.getURL.set(true);
  },
  'keyup input:text[name=urlInput]': function(e, template){
  	  	template.enableURL.set(e.target.value);
  },
  'click .urlSubmit': function(e, template){
	    e.preventDefault();
	    //console.log(e.target.value);
	    //var element = template.find('input:text[name=urlInput]');
    	var fileUrl = template.enableURL.get();
    	if(fileUrl){
	    	if(template.data.type==="photo"){
			    //element.val();
			    
			    var mytemp = template;
			    var callme = function( error, response ) {
				  // Handle the error or response here.
			  		if(error){
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

				if(fileUrl.indexOf("vimeo.com") > -1 || fileUrl.indexOf("youtube.com") > -1){

					var data = {
						filepath : fileUrl,
						name : "Default Name",
						size : null,
						type: "video",
						key: null,
						id: template.data.resourceID
					}
					Meteor.call( "storeUrlInDatabase", data, null, function ( error ) {
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
		resize: null,

		_getFileFromInput: function ( event ) {
			return event.target.files[0];
		},
		_setPlaceholderText: function(string) {//string = "Click or Drag a File Here to Upload" 
		  this.template.find( "span.placeholder" ).innerText = string;
		},
		//give either event or file and template
		//give callback
		init : function(template){
			this.template = template;
			this.callback = template.data.callback;	
			this.callback = template.data.resize;	
			this.type = template.data.type;
			

			return this;
		},
		upload : function( options ) {
		  var file = null;
		  if(this.callback && this.callback.start) this.callback.start();
		  if(options.event){
		  	file = this._getFileFromInput( options.event );
		  }
		  else{
		  	let contentType = this._getContentType(options.base64);

		  	let blob = this._dataURItoBlob(options.base64, contentType);
		    let name = new Date().toString()+"."+contentType.split("/")[1];
		  	file = this._blobToFile(blob, name);
		  }

		  this._setPlaceholderText( `Uploading ${file.name}...` );
		  this._uploadFileToAmazon( file , options);
		},
		_getContentType : function(base64){
			return base64.split(":")[1].split(";")[0];
		},
		_uploadFileToAmazon :function ( file , options) {
		  var self = this;
		  Meteor.call("nameFiles", self.type+"/"+file.name, function(error, key){

		  	if(error){
		  		console.log(error);
		  	}
			else{
				var metaContext = {key: key};
				var uploadMe = function(file){
				  self.uploader = new Slingshot.Upload( "uploadToAmazonS3", metaContext);

				  self.template.filename.set(file.name);
				  self.template.onUpload.set(self.uploader);

				  //var self = this;
				  self.uploader.send( file, function( error, url ){
				  	//self.template.onUpload.set();
				    if ( error ) {
				      Bert.alert( error.message, "warning" );
				      self._setPlaceholderText();
				    } else {
				      self._addUrlToDatabase( url , file, key);

				     /* if(self.type=="attachment" && file.name.endsWith(".pdf")){
				      		console.log("key "+key);
							Meteor.call("makePdfThumbnail", key, {width:200});
				      }*/
				    }
				  });
				}

				if(self.type=="photo" && self.resize){ //this.type=="photo" && this.resize
					Resizer.resize(file, self.resize, function(err, smallFile) {
						console.log("small thumbnail");
						  uploadMe(smallFile);
					 });
				}
				
				else{
					uploadMe(file);
				}
			 }
		  });
		  
		},
		_addUrlToDatabase : function( filepath , file, key) {
			var data = {
				filepath : filepath,
				name : file.name,
				size : file.size,
				type: this.type,//this.template.data.type,
				id: this.template.data.resourceID,
				key: key,

			}
		  var self = this;
		  Meteor.call( "storeUrlInDatabase", data, function ( error, result ) {
		    if ( error ) {
		      Bert.alert( error.reason, "warning" );
		      self._setPlaceholderText();
		    } else {
		      Bert.alert( "File uploaded to Amazon S3!", "success" );
		     	self.template.find(".upload-input").value="";
		      	self.template.onUpload.set(0);
		      	self._setPlaceholderText();
		      if(self.callback && self.callback.finished){
		      	console.log("I'm so sad!!");
		      	self.callback.finished(result)};
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
// each upload_multiple template instance holds its own local collection of files list

bytesToSize = function(bytes) {
  if (bytes == 0) return '0 Byte';
  var k = 1000;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toPrecision(3) + '&nbsp;' + sizes[i];
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

Template['customUpload'].created = function () {
  Uploader.init(this);

  // copy values to context
  if (this.data) {
    this.autoStart = this.data.autoStart;
  }
};

Template['customUpload'].helpers({
  'class': function(where) {
    return Uploader.UI[this.type][where];
  },
  'uploadContext': function() {
    return Template.instance();
  },
  'submitData': function() {
    if (this.formData) {
      this.formData['contentType'] = this.contentType;
    } else {
      this.formData = {contentType: this.contentType};
    }
    return typeof this.formData == 'string' ? this.formData : JSON.stringify(this.formData);
  },
  'infoLabel': function() {
    var instance = Template.instance();

    var progress = instance.globalInfo.get();
    var info = instance.info.get()
    // we may have not yet selected a file
    if (!instance.info.get()) {
      return "";
    }

    return progress.running ?
      Uploader.formatProgress(info.name, progress.progress, progress.bitrate) :
      (info.name + '&nbsp;<span style="font-size: smaller; color: #333">' + bytesToSize(info.size) + '</span>');
  },
  'progress': function() {
    return 'width:' + Template.instance().globalInfo.get().progress + '%';
  },
  buttonState: function() {
    var that = Template.instance();
    return {
      'idle': function () {
        return !that.globalInfo.get().running;
      },
      'cancelled': function () {
        return that.globalInfo.get().cancelled;
      },
      'waiting': function () {
        return that.globalInfo.get().progress !== 100;
      },
      'removeFromQueue': function() {
        return false;
      }
    }
  },
  'queueItems': function() {
    return Template.instance().queueView.get();
  },
  'showQueue': function() {
    return Template.instance().queueView.get().length > 1;
  }
});

Template['customUpload'].rendered = function () {
  Uploader.render.call(this);
};

Template['customUpload'].events({
  'click .cameraPicture': function(e, template){
    e.preventDefault();
    MeteorCamera.getPicture({}, function(e,data){
      console.log(data);
      var blob = dataURItoBlob(data);
      var name = Random.id()+"jpg";
      var file = blobToFile(blob, name);
      //var formData = new FormData();
      this.formData.append( 'files', blob, name );

      //template.$('.myfile').data.files = new FileList();
      //template.$('.myfile').data.files[0] = file;
    });
  }
});
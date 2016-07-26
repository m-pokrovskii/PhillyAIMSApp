Template.PhotoUpload.onCreated(function(){
	this.uploadPicsOption = new ReactiveVar();
	this.uploadThumb = this.data.spotlightData.photo;
	//console.log(this.data.photo);
});


Template.PhotoUpload.helpers({
  uploadPicsOption: function(state){
  	return Template.instance().uploadPicsOption.get();
  },
  myCallbacks: function (fileInfo) {
    var template = Template.instance();
    template.uploadThumb.push({filepath: fileInfo.url, 
    size: fileInfo.size, 
    name: fileInfo.name, _id: Random.id()} ); //_id: _id 
    Session.set('submitSpotlight', true);
  },
  photosToUpload: function() {
    return Template.instance().uploadThumb.list();//Template.instance().uploadThumb.get();
  }
});



Template.PhotoUpload.events({
    'click .deleteUpload': function (event, template) {
    event.preventDefault();
    if (confirm('Are you sure?')) {
      var targetID = event.currentTarget.getAttribute("data-id");
      var result = $.grep(template.uploadThumb.array(), 
        function(e){ 
          return e._id == targetID; 
        });
      var filename = result[0].name;

      
      Meteor.call('deleteFile', filename, null, function(error, result) {
        if(!error){ 
          //template.uploadThumb.splice(targetIndex, 1);
          template.uploadThumb.remove(
            function(item) {
               return item._id === targetID
          });
          Session.set('submitSpotlight', true);    
        }
        else{
          console.log(error);
        }
      });
    }
  }
})
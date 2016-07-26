
Meteor.startup(function() {
  Uploader.uploadUrl = Meteor.absoluteUrl("upload");
  
  Template.registerHelper('equals', function (a, b) {
	return a === b;
   });
});

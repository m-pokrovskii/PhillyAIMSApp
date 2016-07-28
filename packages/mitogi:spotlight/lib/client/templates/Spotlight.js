Template.registerHelper( 'arrayHasObject', ( array ) => {
  return array ? array.length > 0 : false;
});

Template.SpotlightShow.onCreated( function() {
	this.ready = new ReactiveVar(false);
    this.mySpotlight = new ReactiveVar();
    var self = this;
    self.autorun(function () {

    var subscription = self.subscribe( 'resourceFiles', FlowRouter.getParam("_id"));
    if (subscription.ready()) {

        var spotlight = {
          attachment: new Array(),
          photo: new Array(),
          video: new Array(),
        }
        
        Files.find().forEach(function(doc){
          spotlight[doc.type].push(doc);
        });

          self.mySpotlight.set(spotlight);
          self.ready.set(true);
    }
  });
});

Template.SpotlightShow.helpers({
	ready: function () {
	  return Template.instance().ready.get();
	},
	spotlight: function(){
		return Template.instance().mySpotlight.get();
	},
	editMode: function(){
		return false;
	},
	array: function(type){
		return Files.find( { type: type});
	}

});
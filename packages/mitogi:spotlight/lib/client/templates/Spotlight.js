Template.registerHelper( 'arrayHasObject', ( array ) => {
  return array ? array.length > 0 : false;
});

Template.SpotlightShow.onCreated( function() {

	this.ready = new ReactiveVar(false);
    this.mySpotlight = new ReactiveDict();
    var self = this;
    self.autorun(function () {

    var subscription = Telescope.subsManager.subscribe('resourceFiles', FlowRouter.getParam("_id")); //self.subscribe( 'resourceFiles', FlowRouter.getParam("_id"));
    if (subscription.ready()) {

        var spotlight = {
          attachment: new Array(),
          photo: new Array(),
          video: new Array(),
        }
        
        Files.find({resourceID: FlowRouter.getParam("_id")}, { sort: { "order": 1, "added": 1 }}).forEach(function(doc){
          spotlight[doc.type].push(doc);
        });

        self.mySpotlight.set("attachment", spotlight["attachment"]);
        self.mySpotlight.set("video", spotlight["video"]);
        self.mySpotlight.set("photo", spotlight["photo"]);
        //   self.mySpotlight.set(spotlight);
          self.ready.set(true);
    }
  });
});

Template.SpotlightShow.helpers({
	ready: function () {
	  return Template.instance().ready.get();
	},
  hasQA: function () {
    return Template.instance().data.q_a.trim();
  },
	spotlight: function(type){
    //console.log(Template.instance().mySpotlight.get("video"));
		return Template.instance().mySpotlight.get(type);
	},
	editMode: function(){
		return false;
	}
});


/*
* Set up spotlight hooks to resources so spotlights 
* save when resources do
*/
var hookSpotlight = {
    onSuccess: function(formType, post) {
      Session.set('unsavedChanges', false);
      //Session.set('submitSpotlight', true);
  }
};

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

AutoForm.hooks({
  editPostForm: hookSpotlight,
  submitPostForm: hookSpotlight
});

/*
* This is so count works
*/
Template.panelButton.inheritsHelpersFrom('SpotlightUpload');

var types= ["video","photo","attachment"]; //"link"

function animateButtonsSide(){
  $(".splash").find(".spotlight-button").each(function(index, value){
    $( value ).switchClass( "spotlight-button", "spotlight-button-small", 700, "easeInOutQuad" );
  });
   $( ".spotlight-button-container" ).switchClass( "spotlight-button-container", "spotlight-button-container-small", 700, "easeInOutQuad" );
  
}

function switchPanels(myType){
  console.log("onenter");
  myType = myType.toString();

  for (var i = 0; i < types.length; i++) {
    var type = types[i].toString();

    if(type==myType){
  
      $("#"+type+"-panel").show().switchClass( "hide-panel", "show-panel", 400, "easeInOutQuad" );
    }
    else{
       $("#"+type+"-panel").switchClass( "show-panel", "hide-panel", 400, "easeInOutQuad" ).hide();
    }
  }
}

Template.SpotlightUpload.onCreated( function() {
  this.spotlightType = new ReactiveVar();
  this.open = new ReactiveVar(false);
  Session.set('unsavedChanges', false);
  //Session.set('submitSpotlight', false);
  var resourceID = Session.get('resourceID');

  this.ready = new ReactiveVar(false);

  this.photoCount = new ReactiveVar(0);
  this.videoCount = new ReactiveVar(0);
  this.attachmentCount = new ReactiveVar(0);

  var self = this;

  var filesSubscription = Telescope.subsManager.subscribe('myFiles', resourceID);

  self.autorun(function () {

      var subscriptionsReady = filesSubscription.ready(); // ⚡ reactive ⚡

      // if subscriptions are ready, set terms to subscriptionsTerms and update SEO stuff
      if (subscriptionsReady) {
        self.ready.set(true);
        self.attachmentCount.set(Files.find({resourceID: resourceID, type: "attachment"}).count());
        self.photoCount.set(Files.find({resourceID: resourceID, type: "photo"}).count());
        self.videoCount.set(Files.find({resourceID: resourceID, type: "video"}).count());

       

      }//if sub ready
  });//self run
  
});

Template.SpotlightUpload.onRendered( function() {
  var self= this;
  self.autorun(function () {
    if(self.ready){
     if(self.attachmentCount.get() > 0){
            switchPanels("attachment");
            animateButtonsSide();
          
      }
      else if(self.photoCount.get() > 0){
            switchPanels("photo");
            animateButtonsSide();
          
      }
      else if(self.videoCount.get() > 0){
            switchPanels("video");
            animateButtonsSide();
      
      }
    }
  });

});

Template.SpotlightUpload.helpers({
  edit : function(){
    return true;
  },
  resourceID: function(){
    return Session.get('resourceID');
  },
  spotlightType: function() {
    return Template.instance().spotlightType.get();
  },
  countItem: function(name) {
    var name = name+"Count";
    return Template.instance()[name].get();
  },
  set: function(name) {
    return Template.instance().spotlightType.get() ? '' : "hide-panel";
  },
  ready: function() {
    return Template.instance().ready.get();
  },
  callback: function() {
    return Session.set('unsavedChanges', true);
  }
});

Template.SpotlightUpload.events({
  'click div.resource-select': function( event, template ) {
    event.preventDefault();
    var type = event.currentTarget.getAttribute("data-type");

    template.spotlightType.set(type);
    if(!template.open.get()){
      animateButtonsSide();
      template.open.set(true);
    }

    switchPanels(type);
  },
});


/*

function SpotlightData (resourceID) {
    this.initial = null;
    this.video = new ReactiveArray([]);
    this.photo = new ReactiveArray([]);
    this.attachment = new ReactiveArray([]);
    //this.link = new ReactiveArray([]);
    this.resourceID = resourceID;

    this.setInitial = function(){
      //console.log(this.resourceID);
      this.initial = Spotlights.find({_id: this.resourceID}).fetch()[0];
      //console.log(this.initial);
      //can I set?

      var loadInit = function(initArray, myArray){
        var arrayLength = initArray.length;
        for (var i = 0; i < arrayLength; i++) {
            myArray.push(initArray[i]);
        }
      }

      if(this.initial){
        loadInit(this.initial.video, this.video);
        loadInit(this.initial.photo, this.photo);
        loadInit(this.initial.attachment, this.attachment);
        //loadInit(this.initial.link, this.link);
      }
    };

    this.get = function(name){
      return this[name];
    }

    this.removeEmpty = function(array){
      array.remove(function(item) {
       return (!!item.URL && !!item.title);//jQuery.isEmptyObject(item);
      });
      
    }

    this.submit = function(){
      var attrs = {
        video : this.video.array(),
        photo : this.photo.array(),
        attachment : this.attachment.array(),
        link : this.link.array()//this.removeEmpty(this.link.array())
      }
      var select = {_id: this.resourceID};
  
      if(!!this.initial){
        Spotlights.update(select, {$set: attrs});
      }
      else{
        attrs._id = this.resourceID;
        Spotlights.insert(attrs);
        
      }
    };
    
}

function SpotlightData2 (resourceID) {
    this.init = function(resourceID, initial){
      this.initial = initial;
      this.video.set(this.initial.video);
      this.photo.set(this.initial.photo);
      this.attachment.set(this.initial.photo);
    };

    function unsavedChanges(initial, spotlight){
      unsavedChanges = false,
      this.types = ['video','photo','attachment'];

      var changed = false;

      if(!!this.initial && spotlight.exists()){
          this.unsavedChanges = true;
      }
      else{
        var arrayLen = this.types.length;
        for (var i = 0; i < arrayLen; i++) {
          if(_.isEqual(initial[this.types[i]], spotlight[this.types[i]])){
            var changed = true;
            break;
          }
        }
      }
      return changed;
    };

    
}*/

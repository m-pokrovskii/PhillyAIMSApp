

/*
* Set up spotlight hooks to resources so spotlights 
* save when resources do
*/
var hookSpotlight = {
    onSuccess: function(formType, post) {
      Session.set('submitSpotlight', true);
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
  //this.spotlightData = new SpotlightData(Session.get('resourceID'));
  Session.set('submitSpotlight', false);
  var self = this;



   self.autorun(function () {
      var submitMe = Session.get('submitSpotlight');
      if(submitMe){
        self.spotlightData.submit();
        self.spotlightData = new SpotlightData();
        if(!!Posts.findOne(Session.get('resourceID'))){
          Session.set('unsavedChanges', true);
        }
        Session.set('submitSpotlight', false);
      }
  });

  self.autorun(function () {
      // subscribe to the posts publication
      var subscription = self.subscribe( 'SingleSpotlight', ''+Session.get('resourceID'));

      if (subscription.ready()) {
          self.spotlightData.setInitial();

          for (var i = 0; i < types.length; i++) {
            var type = types[i];

            if(self.spotlightData[type].list().length > 0){
              self.spotlightType.set(type);
              switchPanels(type);
              animateButtonsSide();
              
              break;
            }
          }
      }
  });
  
});

Template.SpotlightUpload.onRendered(function(){
  //var type = this.spotlightType.get();
  var self = this;


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
  templateType: function() {
    var type = Template.instance().spotlightType.get();
    if(!!type){
      return type.capitalizeFirstLetter()+"Upload";
    }
    return null;
  },
  spotlightData: function() {
    return Template.instance().spotlightData;
  },
  countItem: function(name) {
    return Template.instance().spotlightData.get(name).list().length;
  },
  set: function(name) {
    return Template.instance().spotlightType.get() ? '' : "hide-panel";
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
    
    

    /*event.target['resource-data']
    
    //$('#yourElement').addClass('animated bounceOutLeft');

    Blaze.renderWithData(Template.someTemplate, {my: "data"}, $("#parent-node")[0])
 
    return Template.instance().spotlightType.get();*/
  },
});




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

    
}

/*function makeLinks(template){
    var index = template.linkIndex.get();
    Blaze.renderWithData(Template.linkInfo, {index:index}, 
      template.$('.links-container').get(0), null, template);
    template.linkIndex.set(index++);
}

function docToForm(data, template){
  $(".link-group ").each
  for(var i =0; i< data.length; i++){
    var targetIndex = event.target.getAttribute("data-index");
    var targetType = event.target.getAttribute("data-type");

  }
}*/

function makeLinks(template){
    var index = template.uploadLink.array().length;
    template.uploadLink.push({index: index});
}



Template.LinkUpload.onCreated(function(){
  this.uploadLink = this.data.spotlightData.link;
  this.linkIndex = new ReactiveVar(0);
});

Template.LinkUpload.onRendered(function(){
  var length = this.uploadLink.array().length;
  var empty = false;

  /*if(length === 0){
    length = 3;
    empty = true;
  }
  for(var i =0; i < length ; i++){
    makeLinks(this);
  }*/
});

Template.LinkUpload.helpers({
  linksToUpload : function(){
    return Template.instance().uploadLink.list();
  }
});


Template.LinkUpload.events({
  'change .link-input': function (event, template) {
    event.preventDefault();
    if(!!template.uploadLink.array()[index]){
      template.uploadLink.list()[index] = {};
    } 
    
    var value = event.target.value;

    var index = event.target.getAttribute("data-index");
    var type = event.target.getAttribute("data-type");
    template.uploadLink.array()[index][type] = value;
  },
  'click .more': function (event, template) {
    event.preventDefault();
    makeLinks(template);
  },
  'click .link-delete': function (event, template) {
    event.preventDefault();
    var index = event.target.getAttribute("data-index");
    template.uploadLink.remove(function(item){
      var val = item.index == index;
      return val;
    });
  }
});

Template.linkShow.helpers({
  nameOrLink : function(name){
    return name ? name : "[Link]";
  },
  makeLink : function(filepath){
    if (filepath.startsWith("www.") || filepath.startsWith("http://")){
      return filepath;
    }
    else {
      return "http://"+filepath;
    }
  }
});
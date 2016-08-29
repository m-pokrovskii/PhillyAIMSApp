Template.pages_menu.helpers({
  hasPages: function () {
    return Pages.find({show:true}).count();
  },
  pages: function () {
    return Pages.find({show:true});
  },
  notMobile: function(moduleClass){
  	return !moduleClass.includes("mobile");
  },
  menuType: function () {
    return this.zone;
    
  }
});

Template.pages_menu2.helpers({
  hasPages: function () {
    return Pages.find({show:true}).count();
  },
  pages: function () {
    return Pages.find({show:true});
  },
  notMobile: function(moduleClass){
  	return !moduleClass.includes("mobile");
  },
  menuType: function () {
    return this.zone;
    
  }
});
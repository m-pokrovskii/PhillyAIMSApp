FlowRouter.route('/', {
  name: 'home',
  action: function() {
  	if(!Meteor.userId()){
  		FlowRouter.go("signIn");
  	}
  	else{
      BlazeLayout.render("layout", {main: "main_posts_list", hero: "home_hero", headerClass: "home-header"});
  	}
  }
});
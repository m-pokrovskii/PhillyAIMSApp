/*function submitSpotlight (post) {
  alert("spotlightsubmit");
  Session.set('submitSpotlight', true);
  return post;
}

Telescope.callbacks.add("postSubmitClient", submitSpotlight);*/


/*PostsController.route( '/', {
  name: 'all',
  action: function(){
    FlowRouter.go('postsDefault');
  }
});*/


FlowRouter.route('/', {
  name: 'all',
  action: function() {
    if(!Meteor.user()){
      FlowRouter.go('signIn');
    }
    else{
      BlazeLayout.render("layout", {main: "main_posts_list", hero: "home_hero", headerClass: "home-header"});
    }
  }
});
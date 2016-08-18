Template.addToHomeScreen.onCreated(function(){

	if(!Meteor.isCordova()){
		addToHomescreen({
		   startDelay: 5,
		   maxDisplayCount: 1
		});
	}
})
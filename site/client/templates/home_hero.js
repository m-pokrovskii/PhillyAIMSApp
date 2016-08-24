Template.home_hero.helpers({
	splashUrl: function(){
		return Settings.get("splashUrl");
	},
	announcement: function(){
		return Settings.get("announcement");
	}
})
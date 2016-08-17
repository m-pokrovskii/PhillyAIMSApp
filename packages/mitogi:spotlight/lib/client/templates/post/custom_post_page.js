
Template.post_page.helpers({
	hasBody: function(){
		console.log("body");
		console.log(Template.instance().data.body);
	    return Template.instance().data.body.trim();
	  },
});

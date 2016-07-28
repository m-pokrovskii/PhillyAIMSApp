Template.footer_code.helpers({
  footerCode: function(){
    return Settings.get('footerCode');
  }
});


Template.footer_code.events({
	'click .get-terms': function(){
		Session.set('modalTitle', "Terms of Use");
		Session.set('modalBody', Settings.get("terms"));
	}
});
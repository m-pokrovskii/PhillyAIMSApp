Template.layout.helpers({
	modalData: function(){
		return {title: Session.get('modalTitle'), body: Session.get('modalBody')}
	}
});

Template.modal.events({
	'click #modal .close': function(){
		Session.set('modalTitle', null);
		Session.set('modalBody', null);
	}
});
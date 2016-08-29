Template.bulkUsers.onCreated( () => {
  Template.instance().uploading = new ReactiveVar( false );
  Template.instance().results = new ReactiveVar();
});

Template.bulkUsers.helpers({
  uploading() {
    return Template.instance().uploading.get();
  },
  results() {
    return Template.instance().results.get();
  },
});

Template.bulkUsers.events({
  'change [name="uploadCSV"]' ( event, template ) {
    template.uploading.set( true );


    Papa.parse( event.target.files[0], {
      header: true,
      complete( results, file ) {
        Meteor.call( 'bulkMakeUser', results.data, ( error, response ) => {
          if ( error ) {
            console.log( error.reason );
          } else {
            template.uploading.set( false );
            Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
    
            	template.results.set(response);

          }
        });
      }
    });
  }
});
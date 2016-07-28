Meteor.publish( 'resourceFiles', function(resourceID){
  var data = Files.find( { resourceID: resourceID} );

  if ( data ) {
    return data;
  }

  return this.ready();
});
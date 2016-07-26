Meteor.publish('SingleSpotlight', function(id) {
  check(id, String);
  this.unblock();
  return Spotlights.find({_id: id});
});

Meteor.publish( 'resourceFiles', function(id){
  return Files.find( { resourceID: id} );
});
Meteor.publish( 'filesByURL', function(url){
  var data = Files.find( { filepath: url} );

  if ( data ) {
    return data;
  }

  return this.ready();
});


Meteor.publish( 'myFiles', function(resourceID, type){

  var data = Files.find( { resourceID: resourceID, type: type });

  if ( data ) {
    return data;
  }

  return this.ready();
});

Meteor.publish( 'resourceFiles', function(resourceID){
  var data = Files.find( { resourceID: resourceID} );

  if ( data ) {
    return data;
  }

  return this.ready();
});

	

//https://atmospherejs.com/froatsnook/request
        
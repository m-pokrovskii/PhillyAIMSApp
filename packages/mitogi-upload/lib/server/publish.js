Meteor.publish( 'files', function(){
  var data = Files.find( { "userId": this.userId } );

  if ( data ) {
    return data;
  }

  return this.ready();
});


Meteor.publish( 'myFiles', function(id, type){
  console.log({ resourceID: id, type: type } );
  var data = Files.find( { resourceID: id, type: type } );

  if ( data ) {
    return data;
  }

  return this.ready();
});

Meteor.publish( 'resourceFiles', function(id, ){
  var data = Files.find( { resourceID: id} );

  if ( data ) {
    return data;
  }

  return this.ready();
});




Meteor.methods({
	urlCall : function(fileUrl){
		try{
			check(fileUrl, String);
			 var result = request.getSync(fileUrl, {encoding: null}).response;
	        return 'data:'+result.headers['content-type']+';base64,' + new Buffer(result.body).toString('base64');
    	}
    	catch(err) {
    		console.log(err);
    	}
    }
});

	

//https://atmospherejs.com/froatsnook/request
        
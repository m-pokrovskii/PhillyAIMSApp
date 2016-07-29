Meteor.publish( 'filesByURL', function(url){
  var data = Files.find( { filepath: url} );

  if ( data ) {
    return data;
  }

  return this.ready();
});


Meteor.publish( 'myFiles', function(resourceID, type){

  var data = Files.find( { resourceID: resourceID, type: type } );

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
        
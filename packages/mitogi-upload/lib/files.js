Files = new Meteor.Collection( 'files' );

/*SimpleSchema  =

filepath: data.filepath,
        userId: Meteor.userId(),
        added: new Date(), 
        name: data.name,
        size: data.size,
        key: data.key,
        resourceID: data.id,
        type: data.type,
*/
Files.allow({
  insert: function() { return false; },
  update: function() { return false; },
  remove: function() { return false; }
});

Files.deny({
  insert: function(){ return true; },
  update: function(){ return true; },
  remove: function(){ return true; }
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
    },
    setFilesMetadata : function(id, name, order){
    	Files.update({_id:id}, {$set:{name:name, order:order}});
    }
});

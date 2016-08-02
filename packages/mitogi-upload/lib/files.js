Files = new Meteor.Collection( 'files' );


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

FilesSchema = new SimpleSchema({
  userId: {
    type: String
  },
  added: {
    type: Date,
    optional: true
  },
  name: {
    type: String,
    optional: true
  },
  size: {
    type: Number,
    optional: true
  },
  key: {
    type: String
  },
  resourceID: {
    type: String,
    optional: true
  },
  type: {
    type: String
  }
});

Files.attachSchema(FilesSchema);

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

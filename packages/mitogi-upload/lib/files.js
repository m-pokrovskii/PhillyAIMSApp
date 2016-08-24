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
    type: String,
    optional: true
  },
  resourceID: {
    type: String,
    optional: true
  },
  type: {
    type: String
  },
  filepath: {
    type: String
  },
  noShow: {
    type: Boolean,
    optional: true
  },
  order: {
    type: Number,
    optional: true,
    defaultValue: 0,
  },
  desc: {
    type: String,
    optional: true
  },
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
    setFileName : function(id, name){
    	Files.update({_id:id}, {$set:{name:name}});
    }
    ,
    setFileDesc : function(id, desc){
      Files.update({_id:id}, {$set:{desc:desc}});
    }
    ,
    setFileOrder : function(id, order){
      Files.update({_id:id}, {$set:{order:order}});
    }
});

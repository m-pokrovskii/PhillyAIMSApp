Meteor.methods({
  /*cleanKey : function(key){
    return key.replace(/\+/g, " ").split(".")[-2];
  },*/
  storeUrlInDatabase: function( data ) {
    //check( data.url, String );
    //check( data.name, String );
    //check( data.size, Number );
    Modules.both.checkUrlValidity( data.url );

    var key = data.type + "/" + data.name;
    
    try {
      Files.insert({
        filepath: data.url,
        userId: Meteor.userId(),
        added: new Date(), 
        name: data.name,
        size: data.size,
        key: key,
        resourceID: data.id,
        type: data.type,
      });

      if(data.type==="video"){
        console.log("key"+key);
        Meteor.call('videoEncoder', key);
      }

    } catch( exception ) {
      console.log(exception);
      return exception;
    }
  },
  insertFiles: function(data, key){
    Files.insert({
        filepath: data.url,
        userId: Meteor.userId(),
        added: new Date(), 
        name: data.name,
        size: data.size,
        key: key,
        resourceID: data.id,
        type: data.type,
      });
  },
  deleteS3File: function( id ) {
    check( id, String );

    try {

        var key = Files.findOne({_id: id}).key;
        var type = Files.findOne({_id: id}).type;

        Files.remove({_id: id});
        //if not just a link
        if(key){

          var objKey = [];
          if(type==="video"){
            var shortKey = key.substring(0, key.lastIndexOf("."));
            objKey.push(shortKey+".webm");
            objKey.push(shortKey+".mp4");
          }
          else{
            objKey.push(key);
          }

          Meteor.call("_deleteFilesWithKey",objKey);
     
      }
      
      //then delete from s3
    } catch( exception ) {
      console.log(exception);
      return exception;
    }
  },
  //pass an array of keys to delete
  _deleteFilesWithKey: function(objKey){

    try{
      AWS.config.update({
             accessKeyId: Meteor.settings.AWSAccessKeyId,
             secretAccessKey: Meteor.settings.AWSSecretAccessKey
          });

      var s3 = new AWS.S3();

      if(typeof objKey === "string"){
        objKey = [objKey];
      }

      for(var i =0; i< objKey.length; i++){
        var params = {
            Bucket: Meteor.settings.AWSBucket,
            Key : objKey[i]
          };

        var deleteObject = Meteor.wrapAsync(s3.deleteObject(params, function(error, data) {
              if(error) {
                 console.log(error);
              } else {
                return true;
              }
          })
        );
      }

      deleteObject(params);
    } catch( exception ) {
      console.log(exception);
      return exception;
    }

  },
  updateMetadata: function( id , name ) {
    //check( data.url, String );
    //check( data.name, String );
    //check( data.size, Number );
    Modules.both.checkUrlValidity( url );

    try {
      Files.update({_id: id},
        {$set:
        {name: name,
        description: description}
      });
      //then delete from s3
    } catch( exception ) {
      return exception;
    }
  },
  getBucket: function(){
    return Meteor.settings.AWSBucket;
  },
  videoEncoder: function( key ) {
    check( key, String );

    try {
       //var key = Files.findOne({_id: id}).key;

     var bucket = Meteor.settings.AWSBucket;
     var pipelineId = "1469110855793-ii3s3b";
    
     var srcKey = decodeURIComponent(key.replace(/\+/g, " ")); //the object may have spaces  
     var newKey = srcKey.split(".")[0].split("/")[1];

        
        AWS.config.update({
           accessKeyId: Meteor.settings.AWSAccessKeyId,
           secretAccessKey: Meteor.settings.AWSSecretAccessKey
        });

        var s3 = new AWS.S3();

        var elastictranscoder = new AWS.ElasticTranscoder({
         apiVersion: "2012–09–25",
         region: "us-east-1"
        });

        function outputsArray(){
             var array = [];
             if (!key.endsWith("webm")){
              array.push({Key: newKey + ".webm",
               //ThumbnailPattern: "thumbs-" + newKey,
               PresetId: '1351620000001-100240', //Webm 720p
              });
             }

            if (!key.endsWith("mp4")){
              array.push({Key: newKey + ".mp4",
               //ThumbnailPattern: "thumbs/" + newKey,
               PresetId: '1351620000001-000010', //Webm 720p
              });
            }

            return array;
          }

          var outputs = outputsArray();

        var params = {
          PipelineId: "1469110855793-ii3s3b",
          OutputKeyPrefix: "video/",
          Input: {
           Key: srcKey,
           FrameRate: "auto",
           Resolution: "auto",
           AspectRatio: "auto",
           Interlaced: "auto",
           Container: "auto"
          },
          Outputs: outputs

        };

        console.log(params);


        var elasticGo = Meteor.wrapAsync(
           elastictranscoder.createJob(params, function(error, data) {
              if(error) {
                 console.log(error);
              } else {
                 Meteor.call("_deleteFilesWithKey",[key]);
                 console.log("Job well done");
                 return true;
              }
           })
        );

        if(elasticGo( params )){
          return true;
        }

      
      //then delete from s3
    } catch( exception ) {
      console.log(exception);
      return exception;
    }
  },
});

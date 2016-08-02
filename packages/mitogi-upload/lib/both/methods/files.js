Meteor.methods({
  /*cleanKey : function(key){
    return key.replace(/\+/g, " ").split(".")[-2];
  },*/
  storeUrlInDatabase: function( data) {
    //check( data.url, String );
    //check( data.name, String );
    //check( data.size, Number );
    //Modules.both.checkUrlValidity( data.filepath );

    try {
      Files.insert({
        filepath: data.filepath,
        userId: Meteor.userId(),
        added: new Date(), 
        name: data.name,
        size: data.size,
        key: data.key,
        resourceID: data.id,
        type: data.type,
      });

      if(data.type==="video" && data.key!==null){
        Meteor.call('videoEncoder', data.key);
      }
      
      return data;

    } catch( exception ) {
      console.log(exception);
      return exception;
    }
  },
  nameFiles: function(firstKey){
    var key = firstKey;
    var breakIndex = key.lastIndexOf(".");
    var shortKey = key.substring(0, breakIndex);
    var end = key.substring(breakIndex);
    var count = 0;
    while(key!==null && !!Files.findOne({key: key})){
      count++;
      key = shortKey+" ("+count+")"+end;
      if(count>300){
        break;
      }
    }
    return key;
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

        /*var deleteObject = Meteor.wrapAsync(s3.deleteObject(params, function(error, data) {
              if(error) {
                 console.log(error);
              } else {
                return true;
              }
          })
        );*/

        s3.deleteObject(params, Meteor.bindEnvironment(function (error, data) {
            if(error) {
              console.log(error);
            } else {
              return true;
            }
        }));
      }

      //deleteObject(params);
    } catch( exception ) {
      console.log(exception);
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

        var elasticGo = Meteor.wrapAsync(
           elastictranscoder.createJob(params, function(error, data) {
              if(error) {
                 console.log(error);
              } else {
                 console.log("Job well done");
                 return true;
              }
           })
        );

      
      //then delete from s3
    } catch( exception ) {
      console.log(exception);
      return exception;
    }
  },
});

Meteor.methods({
  /*cleanKey : function(key){
    return key.replace(/\+/g, " ").split(".")[-2];
  },*/
  storeUrlInDatabase: function( data ) {
    //check( data.url, String );
    //check( data.name, String );
    //check( data.size, Number );
    Modules.both.checkUrlValidity( data.url );

    var pathname = '';
    if(data.name.match(/\.(jpg|jpeg|png|gif)$/)){
      pathname = "images/"
    }
    else if(data.name.match(/\.(avi|mpeg|mp4|mov|wav)$/)){
      pathname = "videos/"
    }
    else{
      pathname = "uploads/"
    }
    var key = pathname + data.name;
    
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
  deleteS3File: function( id ) {
    check( id, String );
    //check( data.name, String );
    //check( data.size, Number );
    //Modules.both.checkUrlValidity( url );

    try {

        var key = Files.findOne({_id: id}).key;
        AWS.config.update({
           accessKeyId: Meteor.settings.AWSAccessKeyId,
           secretAccessKey: Meteor.settings.AWSSecretAccessKey
        });

        var s3 = new AWS.S3();
        var params = {
           Bucket: Meteor.settings.AWSBucket,
           Key: filename
        };

        console.log(params);

        var deleteObject = Meteor.wrapAsync(
           s3.deleteObject(params, function(error, data) {
              if(error) {
                 console.log(error);
              } else {
                 return true;
              }
           })
        );

        if(deleteObject( params )){
          Files.remove({_id: id});
        }

      
      //then delete from s3
    } catch( exception ) {
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
     var pipelineId = "1469104289463-i7ck5c";
    
     var srcKey = decodeURIComponent(key.replace(/\+/g, " ")); //the object may have spaces  
     var newKey = key.split(".")[0].split("/")[1];

        
        AWS.config.update({
           accessKeyId: Meteor.settings.AWSAccessKeyId,
           secretAccessKey: Meteor.settings.AWSSecretAccessKey
        });

        var s3 = new AWS.S3();

        var elastictranscoder = new AWS.ElasticTranscoder({
         apiVersion: "2012–09–25",
         region: "us-east-1"
        });

        var params = {
          PipelineId: "1469110855793-ii3s3b",
          OutputKeyPrefix: "videos/",
          Input: {
           Key: srcKey,
           FrameRate: "auto",
           Resolution: "auto",
           AspectRatio: "auto",
           Interlaced: "auto",
           Container: "auto"
          },
          Outputs: [
          {Key: newKey + ".webm",
           ThumbnailPattern: "thumbs-" + newKey,
           PresetId: '1351620000001-100240', //Webm 720p
          },
          {Key: newKey + ".mp4",
           ThumbnailPattern: "thumbs/" + newKey,
           PresetId: '1351620000001-000010', //Webm 720p
          }]
        };



        var elasticGo = Meteor.wrapAsync(
           elastictranscoder.createJob(params, function(error, data) {
              if(error) {
                 console.log(error);
              } else {
                 console.log(data);
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
      return exception;
    }
  },
});

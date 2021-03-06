  //pass an array of keys to delete
  function _deleteFilesWithKey(objKey){

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

        //var deleteObject = Meteor.wrapAsync(s3.deleteObject , params,);

        s3.deleteObject(params, Meteor.bindEnvironment(
            function(err, data){
                if(err)
                    console.log(error);
                else
                  console.log("success");
            },
            function(e){
                //bind failure
                console.log(e);
            }
        ));
        //);

        //deleteObject(params);
      }

      //deleteObject(params);
    } catch( exception ) {
      console.log(exception);
      //return exception;
    }

  }

  Meteor.methods({
  /*cleanKey : function(key){
    return key.replace(/\+/g, " ").split(".")[-2];
  },*/
  storeUrlInDatabase: function( data) {
    //check( data.url, String );
    //check( data.name, String );
    //check( data.size, Number );
    //Modules.both.checkUrlValidity( data.filepath );

    /*if(data.type==="video" && data.key!==null){
      console.log(data.key);
        data.key = 
    }*/

    var noShow = data.key===null ? false : true;

    try {
      var fileID = Files.insert({
        filepath: data.filepath,
        userId: Meteor.userId(),
        added: new Date(), 
        name: data.name,
        size: data.size,
        key: data.key,
        resourceID: data.id,
        type: data.type,
        noShow: noShow,
      });

      if(data.type==="video" && data.key!==null){
        var callback = {finished:function(){
            Files.update({key:data.key},{$set:{noShow:false}})
          }
        };
        Meteor.call('videoEncoder', data.key, callback);
    }


      
      var result = Files.findOne({_id: fileID});
      
      return result;

    } catch( exception ) {
      console.log(exception);
      return exception;
    }
  },
  nameFiles: function(firstKey){
    if(firstKey!==null){
      var key = firstKey;
      var breakIndex = key.lastIndexOf(".");
      var shortKey = key.substring(0, breakIndex);
      var end = key.substring(breakIndex);
      var count = 0;
      while(!!Files.findOne({key: key})){
        count++;
        key = shortKey+" ("+count+")"+end;
        if(count>300){
          break;
        }
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
            objKey.push(+shortKey.replace("video/","video/thumbnails/")+"-00001.png");
          }
          else{
            objKey.push(key);
          }

          //Meteor.call("_deleteFilesWithKey",objKey);

          _deleteFilesWithKey(objKey);
        }

      
      //then delete from s3
    } catch( exception ) {
      console.log(exception);
      return exception;
    }
  },

  getBucket: function(){
    return Meteor.settings.AWSBucket;
  },
  videoEncoder: function( key, callback ) {
    check( key, String );

    try {
       //var key = Files.findOne({_id: id}).key;

     var bucket = Meteor.settings.AWSBucket;
    
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

        var deleteKey = true;

        function outputsArray(){
             var array = [];
             if (!key.endsWith("webm")){
              array.push({Key: newKey + ".webm",
               PresetId: '1351620000001-100240', //Webm 720p
               //ThumbnailPattern: 'thumbnails/'+newKey+'-{count}', 
               Rotate: 'auto'
              });
             }
             else{
              deleteKey = false;
             }

            if (!key.endsWith("mp4")){
              array.push({Key: newKey + ".mp4",
               //ThumbnailPattern: "thumbs/" + newKey,
               PresetId: '1351620000001-000010', //Webm 720p
              });
            }
            else{
              deleteKey = false;
             }

            return array;
          }

          var outputs = outputsArray();

        var params = {
          PipelineId: "1470942864170-m1y5ok",
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

        var elasticGo = //Meteor.wrapAsync(
           elastictranscoder.createJob(params, Meteor.bindEnvironment(function(error, data) {
              if(error) {
                 console.log(error);
              } else {
                 //console.log("Job well done");
                 

                console.log(data);
                 var waitParam = {
                    Id: data.Job.Id /* required */
                };

                elastictranscoder.waitFor('jobComplete', waitParam, Meteor.bindEnvironment(function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else{
                      console.log("delete key: "+ key);
                      
                      if(deleteKey){
                        _deleteFilesWithKey(key); 
                       }

                      callback.finished();
                      }        // successful response
                })); 
                 
              }
           })
         );
        
        //);

      
      //then delete from s3
    } catch( exception ) {
      console.log(exception);
      return exception;
    }
  }
});
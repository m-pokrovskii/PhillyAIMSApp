

/*Meteor.methods({
    makePdfThumbnail: function(myKey, size){
     /* var async = Meteor.npmRequire('async');
      //var AWS = require('aws-sdk');
      //var gm = Meteor.npmRequire('gm').subClass({ imageMagick: true }); // Enable ImageMagick integration. 
      var gm = Meteor.npmRequire('gm');
      var util = Meteor.npmRequire('util');
      var fs = Meteor.npmRequire('file-system');
      var mktemp = Meteor.npmRequire("mktemp");

      var BUCKET  = Meteor.settings.AWSBucket;


      AWS.config.update({
             accessKeyId: Meteor.settings.AWSAccessKeyId,
             secretAccessKey: Meteor.settings.AWSSecretAccessKey
          });
      AWS.config.update({region: 'us-east-1'});

      var s3 = new AWS.S3();



      var pdfkey = decodeURIComponent(myKey.replace(/\+/g, " ")); 
      var thumbnailkey = "/thumbnails" + myKey.replace(/\.\w+$/, ".png");
      var requestedwidth = 200;
      var requestedheight = 0;
      var shape = "pad";
      var format = "png";
      console.log(myKey);
      // Infer the pdf type.
      var typeMatch = pdfkey.match(/\.([^.]*)$/);
      if (!typeMatch) {
          console.log(('unable to infer pdf type for key ' + pdfkey));
          return;
      }
      var fileType = typeMatch[1];
      if (fileType != "pdf") {
          console.log(('skipping non-pdf ' + pdfkey));
          return;
      }

      // Download the pdf from S3, create thumbnail, and upload to cache.
      async.waterfall([
          function download(next) {
              // Download the pdf from S3 into a buffer.
              s3.getObject({
                  Bucket: BUCKET,
                  Key: pdfkey
              },
              next);
          },
          function thumbnail(response, next) {
              console.log('generating thumbnail');
              var temp_file, image;

              temp_file = mktemp.createFileSync(process.env.PWD+"/.uploads/tmp/XXXXXXXXXX.pdf");
              fs.writeFileSync(temp_file, response.Body);
              image = gm(temp_file + "[0]").flatten().colorspace("CMYK");
              console.log(image);
              image.size(function(err, size) {
                  if ((requestedwidth > 0) && (requestedheight > 0))
                  {

                      if (shape == "pad")
                      {
                          // Transform the image buffer in memory.
                          this.resize(requestedwidth, requestedheight).gravity('Center').background('transparent').extent(requestedwidth, requestedheight)
                          .toBuffer(format.toUpperCase(), function(err, buffer) {
                              if (err) {
                                  next(err);
                              } else {
                                  next(null, response.ContentType, buffer);
                              }
                          });
                      }
                      else
                      {
                          // Transform the image buffer in memory.
                          this.resize(requestedwidth, requestedheight)
                          .toBuffer(format.toUpperCase(), function(err, buffer) {
                              if (err) {
                                  next(err);
                              } else {
                                  next(null, response.ContentType, buffer);
                              }
                          });
                      }
                  }
                  else
                  {
                      if (requestedwidth > 0)
                      {
                          // Transform the image buffer in memory.
                          this.resize(requestedwidth)
                          .toBuffer(format.toUpperCase(), function(err, buffer) {
                              if (err) {
                                  next(err);
                              } else {
                                  next(null, response.ContentType, buffer);
                              }
                          });

                      }
                      else
                      {
                          // Transform the image buffer in memory.
                          this.resize(null, requestedheight)
                          .toBuffer(format.toUpperCase(), function(err, buffer) {
                              if (err) {
                                  next(err);
                              } else {
                                  next(null, response.ContentType, buffer);
                              }
                          });
                      }
                  }
              });
          },
          function upload(contentType, data, next) {
              // Stream the thumbnail
              console.log('uploading thumbnail');
              s3.putObject({
                  Bucket: BUCKET,
                  Key: thumbnailkey,
                  ACL:"public-read",
                  Body: data,
                  ContentType: "image/" + format
              },
              next);
          }
          ], function (err) {
              if (err) {
                  console.log((
                      'Unable to create thumbnail for ' + BUCKET + '/' + pdfkey +
                      ' and upload to ' + BUCKET + '/' + thumbnailkey +
                      ' due to an error: ' + err
                      ));
              } else {
                  console.log(
                      'Successfully resized ' + BUCKET + '/' + pdfkey +
                      ' and uploaded to ' + BUCKET + '/' + thumbnailkey
                      );
              }
          }
          );
    }
});


/*
Meteor.methods({
    makePdfThumbnail: function(myKey, size){


      var async = Meteor.npmRequire("async");
      //var AWS = Meteor.npmRequire("aws-sdk");
      var gm = Meteor.npmRequire("gm").subClass({imageMagick: true});
      var fs = Meteor.npmRequire("file-system");
      var mktemp = Meteor.npmRequire("mktemp");

      var THUMB_KEY_PREFIX = "thumbnails/",
          THUMB_WIDTH = 150,
          THUMB_HEIGHT = 150,
          ALLOWED_FILETYPES = ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'pdf', 'gif'];

      var utils = {
        decodeKey: function(key) {
          return decodeURIComponent(key).replace(/\+/g, ' ');
        }
      };

      AWS.config.update({
             accessKeyId: Meteor.settings.AWSAccessKeyId,
             secretAccessKey: Meteor.settings.AWSSecretAccessKey
          });
      AWS.config.update({region: 'us-east-1'});

      var s3 = new AWS.S3();

    //exports.handler = function(event, context) {
      //key
      var bucket = Meteor.settings.AWSBucket,
      srcKey = utils.decodeKey(myKey),
      dstKey = THUMB_KEY_PREFIX + srcKey.replace(/\.\w+$/, ".png"),
      fileType = srcKey.match(/\.\w+$/);

      if(srcKey.indexOf(THUMB_KEY_PREFIX) === 0) {
        return;
      }

      if (fileType === null) {
        console.error("Invalid filetype found for key: " + srcKey);
        return;
      }

      fileType = fileType[0].substr(1);

      if (ALLOWED_FILETYPES.indexOf(fileType) === -1) {
        console.error("Filetype " + fileType + " not valid for thumbnail, exiting");
        return;
      }

      async.waterfall([

        function download(next) {
            //Download the image from S3
            s3.getObject({
              Bucket: bucket,
              Key: srcKey
            }, next);
          },

          function createThumbnail(response, next) {
            var temp_file, image;

            if(fileType === "pdf") {
              temp_file = mktemp.createFileSync(process.env.PWD+"/.uploads/tmp/XXXXXXXXXX.pdf")// Error: ENOENT, no such file or directory 
              fs.writeFileSync(temp_file, response.Body);
              image = gm(temp_file + "[0]").flatten().colorspace("RGB");;
            } else if (fileType === 'gif') {
              temp_file = mktemp.createFileSync(process.env.PWD+"/.uploads/tmp/XXXXXXXXXX.gif")
              fs.writeFileSync(temp_file, response.Body);
              image = gm(temp_file + "[0]");
            } else {
              image = gm(response.Body);
            }

            image.size(function(err, size) {
              var scalingFactor = Math.min(THUMB_WIDTH / size.width, THUMB_HEIGHT / size.height),
              width = scalingFactor * size.width,
              height = scalingFactor * size.height;

              this.resize(width), height)
              .toBuffer("png", function(err, buffer) {
                if(temp_file) {
                  fs.unlinkSync(temp_file);
                }

                if (err) {
                  next(err);
                } else {
                  next(null, response.contentType, buffer);
                }
              });
            });
          },

          function uploadThumbnail(contentType, data, next) {
            s3.putObject({
              Bucket: bucket,
              Key: dstKey,
              Body: data,
              ContentType: "image/png",
              ACL: 'public-read',
              Metadata: {
                thumbnail: 'TRUE'
              }
            }, next);
          }

          ],
          function(err) {
            if (err) {
              console.error(
                "Unable to generate thumbnail for '" + bucket + "/" + srcKey + "'" +
                " due to error: " + err
                );
            } else {
              console.log("Created thumbnail for '" + bucket + "/" + srcKey + "'");
            }

            //context.done();
          });
  }
});*/
/*
filepath



var srcKey =  decodeURIComponent(filepath.replace(/\+/g, " ")); //the object may have spaces  
 var newKey = key.split('.')[0];


elastictranscoder.createJob({ 
  PipelineId: "1469098875831-c0ud51", // specifies output/input buckets in S3 
  OutputKeyPrefix: '' 
  Input: { 
    Key: filepath, 
    FrameRate: 'auto', 
    Resolution: 'auto', 
    AspectRatio: 'auto', 
    Interlaced: 'auto', 
    Container: 'auto' }, 
  Output: { 
    [{
	   Key: name + ‘.mp4’,
	   ThumbnailPattern: ‘thumbs-’ + name + ‘-{count}’,
	   PresetId: ‘1351620000001–000010’, //Generic 720p
	   Rotate: 'auto'
	  },{
	   Key: name + ‘.webm’,
	   ThumbnailPattern: ‘’,
	   PresetId: ‘1351620000001–100240’, //Webm 720p
	   Rotate: 'auto'
	  }]
  }, 
}, function(error, data) { 
    // handle callback 
});
*/



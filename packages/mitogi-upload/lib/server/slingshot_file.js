
Slingshot.fileRestrictions("uploadToAmazonS3", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif", "image/bmp", "image/tiff",
  "video/*", "video/mp4", "video/mpeg", "video/webm", "video/avi", "video/quicktime", "video/m4v",
	"video/3gpp", "video/3gpp2", "video/3gpp", "video/3gpp2", "video/x-ms-wmv",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/msword",
	"application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel",
	"audio/mpeg", "audio/mid", "audio/wav", "audio/x-ms-wma",
	"application/pdf", "text/plain",
  "application/x-compressed", "application/x-zip-compressed", "application/zip", "multipart/x-zip",
  
  ],
  maxSize: 2000 * 1024 * 1024 // 2 GB (use null for unlimited)
});

Slingshot.fileRestrictions("uploadToVideoBucket", {
  allowedFileTypes: [
  "video/mp4", "video/m4v", "video/mpeg", "video/webm", "video/avi", "video/quicktime", 
	"video/3gpp", "video/3gpp2", "video/3gpp", "video/3gpp2", "video/x-ms-wmv",
  ],
  maxSize: 5000 * 1024 * 1024 // 5 GB (use null for unlimited)
});
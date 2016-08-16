Template.test.onRendered(function(){

  Thumbnails.pdf($("#hello"),"http://www.pdf995.com/samples/pdf.pdf",{width:200});
});


Template.test2.helpers({

  myCallbacks: function () {
    return {
        finished: function(index, fileInfo, context) {
        },
    }
  }
});

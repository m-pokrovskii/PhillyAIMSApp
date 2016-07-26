//done

Meteor.startup(function () {
  Template.tag_item.helpers({
    tag: function () {
      return this.item.data;
    },
    formId: function () {
      return 'updateTag-'+ this.item.data._id;
    }
  });

  Template.tag_item.events({
    'click .delete-link': function(e, instance){
      e.preventDefault();

      var tag = instance.data.item.data;

      if (confirm("Delete tag “"+tag.name+"”?")) {
        Meteor.call("removeTag", tag._id, function (error, result) {
          Messages.flash("Deleted tag “"+tag.name+"” and removed it from "+result+" posts");
        });
      }
    }
  });
});

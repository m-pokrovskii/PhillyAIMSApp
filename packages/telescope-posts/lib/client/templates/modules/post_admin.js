Template.post_admin.helpers({
  showApprove: function () {
    return !!Settings.get('requirePostsApproval') && (this.status === Posts.config.STATUS_PENDING || this.status === Posts.config.STATUS_REJECTED);
  },
  showReject: function(){
    return !!Settings.get('requirePostsApproval') && (this.status === Posts.config.STATUS_PENDING || this.status === Posts.config.STATUS_APPROVED);
  },
  shortScore: function(){
    return Math.floor(this.score*100)/100;
  }
});

Template.post_admin.events({
  'click .approve-link': function(e){
    Meteor.call('approvePost', this._id);
    Bert.alert( 'The Post has been approved', 'success', 'growl-top-right' );
    e.preventDefault();
  },
  'click .reject-link': function(e){
    Meteor.call('rejectPost', this._id);
    Bert.alert( 'The Post has been rejected', 'danger', 'growl-top-right' );
    e.preventDefault();
  },
  'click .delete-link': function(e){
    var post = this;

    e.preventDefault();

    if(confirm("Delete “"+post.title+"”?")){
      FlowRouter.go('postsDefault');
      Meteor.call("deletePostById", post._id, function(error) {
        if (error) {
          //console.log(error);
          Bert.alert( error.reason, 'danger', 'fixed-top' );
        } else {
          Bert.alert( i18n.t('your_post_has_been_deleted'), 'success', 'fixed-top' );
        }
      });
    }
  }
});
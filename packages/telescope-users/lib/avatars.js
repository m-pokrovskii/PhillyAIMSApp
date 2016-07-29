Avatar.setOptions({
  fallbackType: 'initials',
  customImageProperty: function() {
    var user = this;
    // calculate the image URL here
    return user.telescope.avatarURL;
  }
  //emailHashProperty: 'telescope.emailHash'
});

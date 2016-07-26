AutoForm.addInputType('tags', {
  template: 'autoformTags',
  valueOut: function() {
    return this.val();
  },
  valueConverters: {
    stringArray: function(value) {
      var arr = value.toLowerCase().split(',');
      for(var i=0; i< arr.length; i++){
        arr[i] = arr[i].trim();
      }
      return arr;
    }
  }
});

Template.autoformTags.created = function() {
  var self;
  self = this;
  self.value = new ReactiveVar;
  this._stopInterceptValue = false;
  return this._interceptValue = function(ctx) {
    if (ctx.value && !self._stopInterceptValue) {
      self.value.set(ctx.value);
      return self._stopInterceptValue = true;
    }
  };
};

Template.autoformTags.rendered = function() {
  var self;
  self = this.$('.js-input');
  self.closest('form').on('reset', function() {
    return self.tagsinput('removeAll');
  });
  self.tagsinput(this.data.atts);
  return this.autorun((function(_this) {
    return function() {
      var value;
      value = _this.value.get();
      if ($.isArray(value)) {
        self.val(value.join(','));
      }
      if (typeof value === 'string') {
        return self.val(value);
      }
    };
  })(this));
};

Template.autoformTags.helpers({
  schemaKey: function() {
    return this.atts['data-schema-key'];
  },
  value: function() {
    Template.instance()._interceptValue(this);
    return Template.instance().value.get();
  }
});


//turn tags into string with comma
AutoForm.hooks({
    after: {
    // Replace `formType` with the form `type` attribute to which this hook applies
    insert: function(error, result) {
      console.log(this.currentDoc);
      insertTags(this.currentDoc.tags);
    },
    update: function(error, result) {
      console.log(this.currentDoc);
      insertTags(this.currentDoc.tags);
    },
  },
  editPostForm: {
    docToForm: function(doc) {
      if (doc.tags === Array){//_.isArray(doc.tags)) {
        doc.tags = doc.tags.join(",");
      }
      return doc;
    }
  }
});
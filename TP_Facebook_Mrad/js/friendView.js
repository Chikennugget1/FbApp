    var FriendView = Backbone.View.extend({
      className:"friend-item span4",

      // See. http://api.jquery.com/html/
      // See. http://underscorejs.org/#template
      tmpl: _.template($('#friendTmpl').html()),

      /**
       * Render the FriendView
       * @chainable
       * @return {FriendView}
       */
      render: function(){
        // See. http://backbonejs.org/#Model-toJSON
        // See. http://underscorejs.org/#template
        // See. http://api.jquery.com/html/
        this.$el.html(this.tmpl(this.model.toJSON()));		
        return this;
      }
    });
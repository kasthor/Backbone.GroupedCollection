(function(){
  var CollectionView = Backbone.CollectionView = function(){
    Backbone.View.apply( this, arguments ); 
    this._sub_views = [];
  }

  var Surrogate = function(){ this.constructor = Backbone.View; };
  Surrogate.prototype = Backbone.View.prototype;
  Backbone.CollectionView.prototype = new Surrogate;

  Backbone.CollectionView.extend = Backbone.View.extend;

  _.extend( Backbone.CollectionView.prototype, Backbone.View.prototype, {
    modelView: Backbone.View,
    _canvas: function(){
      if ( this.canvasSelector ) 
        return this.$( this.canvasSelector );
      else
        return this.$el;
    },
    render: function(){
      var self = this,
          $canvas,
          _iterator = 'each';

      if ( this.template ) 
        this.$el.html( this.template() );
      else 
        this.$el.empty();

      // Compatibility with Backbone.GroupedCollection
      if( this._iterate_collections() ) _iterator = 'each_group'
     
      this._sub_views = [];
      this.collection[_iterator](function(model){
        var _view = self._new_view_for_item( model );
        $(self._canvas()).append( _view.render().el );
      })  

      this._setup_listeners();
      return this;
    },
    _setup_listeners: function(){
      if( ! this._listeners ){
        this._listeners = true;
        if ( this._iterate_collections() ) {
          this.listenTo( this.collection, "add_group", this.add )
          this.listenTo( this.collection, "remove_group", this.remove )
        } else {
          this.listenTo( this.collection, "add", this.add )
          this.listenTo( this.collection, "remove", this.remove )
        }
      }
    },
    _new_view_for_item: function( item ){
      var _view = new this.modelView(this._view_parameters( item ))
      this._sub_views.push( _view );

      return _view;
    },
    _view_for_item: function( item ){
      return _(this._sub_views).find( function( _sv ){ return _sv.model === item } );
    },
    _iterate_collections: function(){
      return  _.isObject(this.collection.subgroups);
    },
    _view_parameters: function( object, options ){
      var _key;
      options || ( options = {});
      _key = ( object instanceof Backbone.Collection ) ? 'collection': 'model';
      
      options[_key] = object; 

      return options;
    },
    add: function( item ){
      var _view = this._new_view_for_item( item );
      this._canvas().append( _view.render().el ); 
    },
    remove: function( item ){
      var _view = this._view_for_item( item );
     
      this._sub_views = _(this._sub_views).without( _view );

      _view.remove(); 
    }
  })
}).call(this)

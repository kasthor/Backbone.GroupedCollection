(function(){

  var Subgroup = Backbone.Subgroup = function( parent, options ){
    if( !(parent instanceof Backbone.Collection) )
      throw "A Parent Collection is required";

    if(!options) options = {};

    _.extend( this, {parent: parent, options: options} );

    this.listenTo( parent, 'add', this.parent_add )
    this.listenTo( parent, 'remove', this.parent_remove )
    this.listenTo( parent, 'change', this.parent_change )

    this._reset();
    this.set( this._filtered_items() );
  }

  Backbone.Subgroup.prototype = Backbone.Collection.prototype;
  Backbone.Subgroup.__super__ = Backbone.Collection.prototype;

  _.extend(Backbone.Subgroup.prototype, Backbone.Collection.prototype, {
    _filtered_items: function(){
      if( ! this.options.filter )
        return this.parent.filter(function(){ return true; });
      else
        return this.parent.where( this.options.filter );
    },
    parent_add: function( item ){
      if( this.match( item ) ) this.add( item );
    },
    parent_remove: function( item ){
      if( this.match( item ) ) this.remove( item );  
    },
    parent_change: function( item ){
      if( this.contains( item ) ) {
        if( ! this.match(item ) ) this.remove( item );
      } else {
        if( this.match( item ) ) this.add( item );  
      }
    },
    match: function( model ){
      for (var key in this.options.filter) {
        if (this.options.filter[key] !== model.get(key)) return false;
      }   
      return true;
    }
  })


  var GroupedCollection = Backbone.GroupedCollection = function( models, options ){
    Backbone.Collection.apply( this, arguments );
    if ( ! this.options ) this.options = {}
    this.listenTo( this, 'add', this.on_add );
    this.listenTo( this, 'remove', this.on_remove );
  }

  Backbone.GroupedCollection.prototype = Backbone.Collection.prototype;
  Backbone.GroupedCollection.__super__ = Backbone.Collection.prototype;
  
 
  _.extend( Backbone.GroupedCollection.prototype, Backbone.Collection.prototype, {
    on_add: function( item ){
      var _group = this._group_field_value( item )
      if( ! _(_.keys( this.subgroups )).contains( _group ) )
        this.add_group( _group );
    },
    on_remove: function( item ){
      var _filter = {},
          _group = this._group_field_value( item );
      _filter[this.options.group_by] = _group;

      if( this.where( _filter ).length <= 0 ) this.remove_group( _group );
    },
    group_by: function( key ) {
      var self = this;
      var _groups = this._groups( key );
      this.options.group_by = key;
      this.subgroups = {};

      _.each( _groups, function( group ){
        var _filter = {};
        _filter[ key ] = group;
        self.subgroups[ group ] = new Subgroup( self, { filter: _filter });
      })
    },
    add_group: function( group ){
      var _filter = {} ;
      _filter[ this.options.group_by ] = group;
      this.subgroups[ group ] = new Subgroup( this, { filter: _filter } );
    },
    remove_group: function( group ){
      if( this.subgroups[ group ] ) delete this.subgroups[group];
    },
    _group_field_value: function( item ){
      return item.get( this.options.group_by );      
    },
    _groups: function( key ){
      var _groups = {};
      this.each(function( model ){
        _groups[ model.get( key ) ] = true;
      })  
      return _.keys( _groups );
    }
  })

}).call(this) ;

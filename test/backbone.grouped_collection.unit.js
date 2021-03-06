(function(){

  var _parent, a1, a2, a3, b1, b2, c1, elements; 

  module("Backbone.GroupedCollection", {
    setup: function(){
      a1 = { letter: 'a', number: 1 }
      a2 = { letter: 'a', number: 2 }
      a3 = { letter: 'a', number: 3 }
      b1 = { letter: 'b', number: 1 }
      b2 = { letter: 'b', number: 2 }
      c1 = { letter: 'c', number: 1 }
      elements = [ a1, a2, b1, b2 ];
    }
  })

  test("can create an instance of a grouped collection", function(){
    var _instance = new Backbone.GroupedCollection();

    ok( _instance instanceof Backbone.GroupedCollection );
  });

  test("can group by a key", function(){
    var _instance = new Backbone.GroupedCollection()

    _instance.group_by( 'letter' );

    ok( _instance instanceof Backbone.GroupedCollection );
  })

  test("has the right amount of groups",1, function(){
    var _instance = new Backbone.GroupedCollection( elements )

    _instance.group_by( 'letter' );
    
    deepEqual( _.keys(_instance.subgroups), [ 'a', 'b' ] )
  })

  test("when grouping it creates the right amount of subgroups", function(){
    var _instance = new Backbone.GroupedCollection( elements )

    _instance.group_by( 'letter' );

    ok( _.keys(_instance.subgroups).length == 2 );
  })

  test("when adding an item that doesn't belong to a group, it creates a new group", function(){
    var _instance = new Backbone.GroupedCollection( elements )
    _instance.group_by( 'letter' );

    _instance.add( c1 );

    deepEqual( _.keys(_instance.subgroups), [ 'a', 'b', 'c' ] );
  })

  test("when a group gets created, it sends a notification with the group", function(){
    var _instance = new Backbone.GroupedCollection( elements )
    _instance.group_by( 'letter' );
    _instance.on("add_group", function( group ){
      ok( group instanceof Backbone.Subgroup ) 
    })
    _instance.add( c1 );
  })


  test("when deleting an item remove the group if it's the last item in the collection", 2, function(){
    var _instance = new Backbone.GroupedCollection( elements )
    var _model;
    _instance.group_by('letter');
    _instance.add( c1 );

    _model = _instance.findWhere( { letter: 'c' } )

    _instance.remove( _model );

    deepEqual( _.keys(_instance.subgroups) , [ 'a', 'b' ] )

    // only if it's the last one

    _model = _instance.findWhere( { letter: 'a' } )
    _instance.remove( _model );

    deepEqual( _.keys(_instance.subgroups) , [ 'a', 'b' ] )
  })

  test("when a group gets removed, it sends a notification with the group", function(){
    var _instance = new Backbone.GroupedCollection( elements )
    var _model;
    _instance.group_by('letter');
    _instance.add( c1 );

    _instance.on("remove_group", function( group ){
      ok( group instanceof Backbone.Subgroup ) 
    })

    _model = _instance.findWhere( { letter: 'c' } )

    _instance.remove( _model );
  })

  test("can iterate the groups", function(){
    var _instance = new Backbone.GroupedCollection( elements )

    _instance.group_by( 'letter' );

    var _groups = _instance.subgroups;
    var _enumerated = [];
    var i = 0;

    _instance.each_group( function( group ){
      _enumerated.push( group );
    }) 

    deepEqual( _.values( _groups ), _enumerated );
  })
}).call( this )

(function(){

  var _parent, a1, a2, a3, b1, b2, c1, elements; 

  module("Backbone.Subgroup", {
    setup: function(){
      _parent = new Backbone.Collection();
      a1 = { letter: 'a', number: 1 }
      a2 = { letter: 'a', number: 2 }
      a3 = { letter: 'a', number: 3 }
      b1 = { letter: 'b', number: 1 }
      b2 = { letter: 'b', number: 2 }
      elements = [ a1, a2, b1, b2 ];
    }
  })

  test("can create an instance of a sub group", function(){
    var _instance = new Backbone.Subgroup( _parent );

    ok( _instance instanceof Backbone.Subgroup );
  });

  test("is an instance of a collection", function(){
    var _instance = new Backbone.Subgroup( _parent );

    ok( _instance instanceof Backbone.Collection );
  });

  test("fails to create if parent collection not provided", function(){
    throws(function(){
      var _instance = new Backbone.Subgroup( null )
    })
    
  });

  test("when no items provided, contains as many items as parent", function(){
    var _instance = new Backbone.Subgroup( _parent );
    
    ok( _parent.length == _instance.length );
  })

  test("when items provided and no filter provided, contains as many items as parent", function(){
    _parent.reset( elements );  

    var _instance = new Backbone.Subgroup( _parent );
    ok( _parent.length == _instance.length );
  })

  test('when items and filter provided, contains just the items that match that filter', 2, function(){
    _parent.reset( elements );

    var _instance = new Backbone.Subgroup( _parent, { filter: { letter: 'a' } });
  
    ok( _instance.length == _parent.where( {letter: 'a' } ).length );
    ok( _instance.where( { letter: 'b' } ).length == 0 );
  })

  test("when there's no filter everything matches", function() {
    var _instance = new Backbone.Subgroup( _parent );
    var _a1 = new Backbone.Model( a1 );
    var _b1 = new Backbone.Model( b1 );

    ok( _instance.match( _a1 ) );
    ok( _instance.match( _b1 ) );
  })

  test("has a way to know if an item matches its criteria when filter provided", function(){
    var _instance = new Backbone.Subgroup( _parent, { filter: { letter: 'a' } });
    var _a1 = new Backbone.Model( a1 );
    var _b1 = new Backbone.Model( b1 );

    ok( _instance.match( _a1 ) );
    ok( !_instance.match( _b1 ) );
  })

  test('when an object is added to the parent collection, the change is reflected on the child', function(){
    _parent.reset(elements);
    var _instance = new Backbone.Subgroup( _parent, { filter: { letter: 'a' }} );

    _parent.add( a3 );

    ok( _instance.length == _parent.where( {letter: 'a' } ).length );
  })

  test("when an object is removed from the parent collection, the change is reflected on the child", function(){
    _parent.reset(elements);  

    var _instance = new Backbone.Subgroup( _parent, { filter: { letter: 'a' }} );
    var _model = _parent.findWhere( { letter: 'a' } );

    _parent.remove( _model );

    ok( _instance.length == _parent.where( {letter: 'a' } ).length );
  })

  test('when an item changes and no longer matches the criteria it gets removed from the collection', function(){
    
    _parent.reset(elements);  

    var _instance = new Backbone.Subgroup( _parent, { filter: { letter: 'a' }} );
    var _model = _parent.findWhere( { letter: 'a' } );

    _model.set('letter', 'c');

    ok( _instance.length == _parent.where( {letter: 'a' } ).length );
  })

  test('when an item changes and now it matches the criteria it gets added from the collection', function(){

    _parent.reset(elements);  

    var _instance = new Backbone.Subgroup( _parent, { filter: { letter: 'a' }} );
    var _model = _parent.findWhere( { letter: 'b' } );

    _model.set('letter', 'a');

    ok( _instance.length == _parent.where( {letter: 'a' } ).length );

  })

}).call(this);

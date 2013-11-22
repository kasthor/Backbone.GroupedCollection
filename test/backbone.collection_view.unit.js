(function(){
  var _collection,
      do_render;

  module( "Backbone.CollectionView", {
    setup: function(){
      _collection = new Backbone.Collection([{ letter: 'a' }, { letter: 'b' }])
      do_render = function(){
          var _collection_view = Backbone.CollectionView.extend({}) 
          var _instance = new _collection_view({ collection: _collection });
          return _instance.render();
      }
    }  
  })

  test("can instantiate a collection view", function(){
    var _instance = new Backbone.CollectionView();  

    ok( _instance instanceof Backbone.CollectionView);
  })

  test("is an instance of a backbone view", function(){
    var _instance = new Backbone.CollectionView();
    
    ok( _instance instanceof Backbone.View );  
  })

  test("has an extend functionality", function(){
    var _sub_view = function(){};
    var _view = Backbone.CollectionView.extend({
      modelView: _sub_view  
    });

    var _instance = new _view();
    
    ok( _instance.modelView === _sub_view  );  
    
  })
  test("trigger the render of the subview as many times as items in the collection", function(){
    var _sub_view = Backbone.View.extend({
      render: function(){
        ok( true );  
        return this;
      }
    })

    expect( _collection.length );

    var _collection_view = Backbone.CollectionView.extend({
      modelView: _sub_view  
    });

    var _instance = new _collection_view({ collection: _collection });
    
    _instance.render();
  })

  test("if a template is specified it calls it", function(){
    expect(1);

    var _template = function(){
      ok( true ) 
      return "";  
    }
    var _collection_view = Backbone.CollectionView.extend({
      template: _template
    });
    
    var _instance = new _collection_view({ collection: _collection });
    
    _instance.render();
  })

  test("creates the right amount of models", function(){
    var _instance = do_render();
    
    equal( $("div", _instance.el).length, 2 )
  })

  test("when adding a model to a collection, it adds it to the dom", function(){
    var _instance = do_render();  

    _collection.add( { letter: 'c' } );

    equal( $("div", _instance.el).length, 3 );
  })

  test("when removing a model from a collection, it removes it from the DOM", function(){
    var _instance = do_render();
    var _item = _collection.findWhere( { letter: 'a' } );
   
    _collection.remove( _item ); 

    equal( $("div", _instance.el).length, 1 );
  })
}).call( this );

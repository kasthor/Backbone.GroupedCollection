(function(){
  var _collection,
      do_render
  module("Backbone.CollectionView (grouped)", {
    setup: function(){
      _collection = new Backbone.GroupedCollection([ 
        {letter: 'a', number: 1},
        {letter: 'a', number: 2},
        {letter: 'b', number: 1},
        {letter: 'b', number: 2} 
      ]);
      _collection.group_by('letter');
      do_render = function(){
        var _collection_view = Backbone.CollectionView.extend({
          modelView: Backbone.CollectionView  
        });
        var _instance = new _collection_view({ collection: _collection })

        return _instance.render();
      }
    }  
  }) 

  test("it has the right amount of group divs for child groups", function(){
    var _instance = do_render();
    equal(_instance.el.children.length, 2);
  });
  test("it has the right amount of group divs for child groups after adding a dissimilar element", function(){
    var _instance = do_render();

    _collection.add( { letter: 'c', number: 1 } )

    equal(_instance.el.children.length, 3);
  });

  test("it has the right amount of group divs for child groups after adding a couple of similar element", function(){
    var _instance = do_render();

    _collection.add( { letter: 'a', number: 3 } )
    _collection.add( { letter: 'a', number: 4 } )

    equal(_instance.el.children.length, 2);
  });
})(this)

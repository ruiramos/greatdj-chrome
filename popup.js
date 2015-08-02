window.app = window.app || {};

var ds = window.app.ds = new DataStorage();

var listComponent = window.app.list.create();
var searchComponent = window.app.search.create();
var playlistFactory = window.app.playlist;

// inter-component events
listComponent.listenTo(searchComponent, 'filter:set', listComponent.setFilter);

// attach components to dom
listComponent.attachTo('[data-hook="list-component"]');
searchComponent.attachTo('[data-hook="search-component"]').render();

ds.onChange(function(){
  updatePopup();
});

function updatePopup(){
  var pls = ds.getPlaylists();

  listComponent.clear();

  for (var i = 0; i < pls.length; i++) {
    listComponent.addPlaylist(playlistFactory.create(pls[i]));
  }

  listComponent.render();
}

function registerButtonHandlers(){
  document.querySelector('[data-action="delete-all"]').addEventListener('click',
    function(){
      ds.resetStorage();
    }
  );
}

document.addEventListener('DOMContentLoaded', function() {
  registerButtonHandlers();
  updatePopup();
});



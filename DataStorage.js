var DataStorage = function(){
  var ds = this;

  this.init = function(){
    this.playlists = [];
    this._updateCallback = function(){};

    chrome.storage.onChanged.addListener(function(changes, namespace) {
      this._updateCallback();
    }.bind(this));

    this.methods._loadDataStorage();

  };

  this.methods = {
     /**
     * Retrieves our saved data from storage.
     * @private
     */
    _loadDataStorage: function() {
      chrome.storage.local.get({
        "playlists": [],
      }, function(storage) {
        ds.playlists = storage.playlists;
        ds._updateCallback();
      });
    },


    /**
     * Persists our state to the storage API.
     * @private
     */
    _saveDataStorage: function(fn) {
      chrome.storage.local.set({
        "playlists": ds.playlists
      }, fn || function(){});
    },

    /**
    * Helper: gets playlist id from url
    *
    */
    _getPlaylistId: function(url){
      var split = url.match(/great\.dj\/(\w+)(?:$|#)/);
      if(split) return split[1];
    }
  };

  this.init();

  return {
    getPlaylists: function(){
      return ds.playlists;
    },

    saveTitleOnPlaylist: function(id, title){
      ds.playlists.forEach(function(pl){
        if(pl.id === id){
          pl.title = title;
        }
      });

      ds.methods._saveDataStorage();

    },

    addPlaylist: function(url){
      var id = ds.methods._getPlaylistId(url);

      if(!id) return;

      var newEntry = {
        id: id,
        link: 'http://great.dj/' + id,
        lastDate: new Date().getTime(),
        content: '',
        artists: '',
        title: '',
      }

      // if we already have it on the list, delete
      for (var i = ds.playlists.length - 1; i >= 0; i--) {
        if(playlists[i].id === id){
          newEntry.title = playlists[i].title;
          delete playlists[i];
          return;
        }
      };

      playlists.unshift(newEntry);

      ds.methods._saveDataStorage();

    },

    removePlaylist: function(id){
      var newArray = [];
      ds.playlists.forEach(function(pl){
        if(pl.id !== id){
          newArray.push(pl);
        }
      });

      ds.playlists = newArray;
      ds.methods._saveDataStorage();

    },

    resetStorage: function(){
      ds.playlists = [];
      ds.methods._saveDataStorage();
    },

    onChange: function(fn){
      ds._updateCallback = fn;
    },
  };
};
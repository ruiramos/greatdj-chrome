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
    }
  };

  this.init();

  return {
    getPlaylists: function(){
      return ds.playlists;
    },
    // addPlaylist: function(playlist){
    //   var found = false;
    //   ds.playlists.forEach(function(pl){
    //     found = found || (pl.id === playlist.id);
    //   });
    //   if(!found){
    //     ds.playlists.push(playlist);
    //     ds.methods._saveDataStorage();
    //   }
    // },
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
    }
  };
};
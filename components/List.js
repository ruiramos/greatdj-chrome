window.app = window.app || {};

var list = {};
Object.assign(list, window.app.Component, {
  el: '<ul class="playlists"></ul>',

  initialize: function(){
    this._playlists = [];
  },

  clear: function(){
    this._playlists = [];
    this.clearElement();
  },

  addPlaylist: function(playlist){
    this._playlists.push(playlist);
  },

  render: function(){
    this.renderDom();

    this.clearElement();

    this.renderPlaylists();

    return this;
  },

  renderPlaylists: function(){
    var pls = this.filter ?
      this._playlists.filter(this._applyFilter.bind(this)) : this._playlists;


    pls.forEach(function(playlist){
      this.appendComponent(playlist);
    }, this)
  },

  setFilter: function(filter){
    this.filter = filter;
    this.clearElement();
    this.renderPlaylists();
  },

  _applyFilter: function(pl){
    return this._matchInString(pl.playlist.id, this.filter) ||
      this._matchInString(pl.playlist.title, this.filter) ||
      this._matchInPlaylist(pl.playlist.videos, this.filter);
  },

  _matchInString: function(s, filter){
    if( (s && s.toUpperCase().indexOf(filter.toUpperCase()) > -1)
      || !filter) return true;
    return false;
  },

  _matchInPlaylist: function(pl, filter){
    if(!pl || !pl.length) return false;

    for (var i = pl.length - 1; i >= 0; i--) {
      if(this._matchInString(pl[i].title || pl[i].snippet.title, filter)){
        return true;
      }
    }

    return false;
  }


});

window.app.list = list;
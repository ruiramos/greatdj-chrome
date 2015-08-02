window.app = window.app || {};

var list = {};
Object.assign(list, window.app.Component, {
  el: '<ul class="playlists" data-hook="message-item">' +
      '</ul>',

  bindings: {
    message: 'message-item'
  },

  props: {
    message: ''
  },

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
    if(!this._playlists.length) return this.renderEmptyState();

    var pls = this._playlists.filter(this._applyFilter.bind(this));

    if(!pls.length) return this.renderEmptySearch();

    pls.forEach(function(playlist){
      this.appendComponent(playlist);
    }, this)
  },

  setFilter: function(filter){
    this.filter = filter;
    this.clearElement();
    this.renderPlaylists();
  },

  renderEmptySearch: function(){
    this.message = '<li class="special-message">Sorry, no results found! :(</li>';
  },

  renderEmptyState: function(){
    this.message = '<li class="special-message">' +
      'No playlists found! Go to <a href="http://great.dj" target="_blank">http://great.dj</a> and create some!' +
      '</li>';
  },

  _applyFilter: function(pl){
    if(!this.filter){
      pl.filterMatch = '';
      return true;
    }

    var prefix = 'Matches ',
        songTitle;

    if(this._matchInString(pl.playlist.title, this.filter)){
      // matches the title
      pl.filterMatch = prefix+'title: <span>'+pl.playlist.title + '</span>';
      return true;

    } else if(songTitle = this._matchInPlaylist(pl.playlist.videos, this.filter)){
      // matches one of the songs
      pl.filterMatch = prefix+'song: <span>'+songTitle + '</span>';
      return true;

    } else if(this._matchInString(pl.playlist.id, this.filter)){
      // matches the id
      pl.filterMatch = prefix+'id: <span>' + pl.playlist.id + '</span>';
      return true;
    }

    return false;
  },

  _matchInString: function(s, filter){
    if( (s && s.toUpperCase().indexOf(filter.toUpperCase()) > -1)
      || !filter) return true;
    return false;
  },

  _matchInPlaylist: function(pl, filter){
    if(!pl || !pl.length) return false;

    for (var i = pl.length - 1; i >= 0; i--) {
      var title = pl[i].title || pl[i].snippet.title;
      if(this._matchInString(title, filter)){
        return title;
      }
    }

    return false;
  }


});

window.app.list = list;
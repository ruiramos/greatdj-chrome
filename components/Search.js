window.app = window.app || {};

var search = {};
Object.assign(search, window.app.Component, {
  el: '<div class="search">' +
        '<input data-hook="search-input" placeholder="Search for description, artists, playlist ids..." name="search" type="text" />' +
      '</div>',

  events: {
    'keyup [data-hook="search-input"]': 'handleSearchInputKeyup',
  },

  handleSearchInputKeyup: function(e){
    this.trigger('filter:set', e.target.value);
  }

});

window.app.search = search;
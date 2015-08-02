window.app = window.app || {};

//
// Decorators
function formatDate(date){
  var dateString = new Date(date).toDateString().split(' ');
  var timeString = new Date(date).toTimeString().split(':');
  return dateString[0] + ', ' + dateString[2]  + ' ' + dateString[1] + ' ' + timeString[0] + ':' + timeString[1];
};

var playlist = {};
Object.assign(playlist, window.app.Component, {
  el: '<li class="playlist" data-hook="playlist-container">' +
        '<div class="info">' +
          '<div class="title">' +
            '<h2 data-hook="title"></h2>' +
            '<input type="text" name="title" data-hook="edit-title" placeholder="Choose a title for this playlist..." />' +
            '<button type="button" data-action="edit-title" class="save-title">Save</button>' +
          '</div>' +
          '<a href="" target="_blank" class="link" data-hook="link link-href"></a>' +
          '<div class="date">Last opened: <span data-hook="lastDate"></span></div>' +
        '</div>' +
        '<span class="buttons">' +
          '<button class="edit" data-action="edit" data-hook="edit-title-button"></button>' +
          '<button class="delete" data-action="delete">X</button>' +
        '</span>' +
        '<div class="contents" data-hook="content"></div>' +
        '<div class="filter-match" data-hook="filter-match"></div>' +
      '</li>',

  bindings: {
    title: ['title', 'edit-title'],
    link: ['link', {
      hook: 'link-href',
      attribute: 'href'
    }],
    lastDate: {
      hook: 'lastDate',
      decorator: formatDate
    },
    content: 'content',
    id: {
      hook: 'playlist-container',
      attribute: 'data-id'
    },
    filterMatch: 'filter-match',
    editButton: 'edit-title-button'
  },

  props: {
    editButton: 'Add title',
    title: '',
    filterMatch: ''
  },

  events: {
    'click [data-action="edit"]': 'handleEditPlaylist',
    'click [data-action="delete"]': 'handleDeletePlaylist',
    'click [data-action="edit-title"]': 'handleEditTitleSave',
    'keydown [data-hook="edit-title"]': 'handleEditTitleKeydown',
  },

  autoRender: true,

  initialize: function(playlist){
    this.playlist = playlist;

    if(this.playlist.title){
      this.title = this.playlist.title;
      this.editButton = 'Edit title';
    }
  },

  render: function(){
    this.renderDom();
  },

  /* Actions! */

  handleDeletePlaylist: function(e){
    app.ds.removePlaylist(e.target.parentNode.parentNode.attributes['data-id'].value);
  },

  handleEditPlaylist: function(e){
    this.toggleTitleForm();
  },

  handleEditTitleSave: function(e){
    console.log('saving playlist title', this.query('input[name="title"]').value , 'to', this.playlist.id);
    this.title = this.query('input[name="title"]').value;

    // save on persistent thing
    app.ds.saveTitleOnPlaylist(this.playlist.id, this.title);

    this.toggleTitleForm();
  },

  handleEditTitleKeydown: function(e){
    if(e.which === 13){
      this.handleEditTitleSave(e);
    }

    return true;
  },

  toggleTitleForm: function(){
    var input = this.query('input[name="title"]'),
        titleForm = this.query('.title');

    if(!this.isEditingTitle){
      this.editButton = 'Cancel';
      titleForm.classList.add('edit');
      input.focus();
    } else {
      this.editButton = 'Add title';
      titleForm.classList.remove('edit');
      if(!this.title) input.value = '';
    }

    this.isEditingTitle = !this.isEditingTitle;
  }

});

window.app.playlist = playlist;
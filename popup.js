
var ds = new DataStorage();

ds.onChange(function(){
  updatePopup();
});

function updatePopup(){
  var playlistRoot = document.querySelector('.playlists'),
      playlistTemplate = document.querySelector('.playlist.template'),
      pls = ds.getPlaylists();

  if(!playlistRoot) return;

  Array.prototype.forEach.call(playlistRoot.querySelectorAll('.playlist'), function(li){
    if(!li.classList.contains('template')){
      li.remove();
    }
  });

  for (var i = 0; i < pls.length; i++) {

    var el = playlistTemplate.cloneNode(true),
        link = el.querySelector('[data-bind=link]'),
        dateEl = el.querySelector('[data-bind=lastDate]'),
        id = pls[i].id;

    el.classList.remove('template');
    el.setAttribute('data-id', id);

    if(pls[i].lastDate)
      dateEl.innerHTML = formatDate(pls[i].lastDate);
    else
      dateEl.innerHTML = '-';

    link.innerHTML = pls[i].link;
    link.setAttribute('href', pls[i].link);
    link.setAttribute('target', "_blank");

    el.querySelector('[data-action="delete"]').addEventListener('click', function(e){
      ds.removePlaylist(id);
    });

    playlistRoot.appendChild(el);
  }

}

function registerButtonHandlers(){
  document.querySelector('[data-action="delete-all"]').addEventListener('click',
    function(){
      ds.resetStorage();
    }
  );
}

function formatDate(date){
  var dateString = new Date(date).toDateString().split(' ');
  return dateString[0] + ', ' + dateString[2]  + ' ' + dateString[1];
}

document.addEventListener('DOMContentLoaded', function() {
  registerButtonHandlers();
  updatePopup();
});



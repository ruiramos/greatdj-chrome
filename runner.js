console.log('great.dj extension started');

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details){
  console.log(1)
  savePlaylist(details.url);
}, {url: [{hostContains: "great.dj"}]});

function savePlaylist(url){
  var id = _getPlaylistId(url);

  if(!id) return;

  chrome.storage.local.get({
    "playlists": [],
  }, function(storage) {
    var playlists = storage.playlists.slice(0, 50);

    var newEntry = {
      id: id,
      link: 'https://great.dj/' + id,
      lastDate: new Date().getTime(),
      content: '',
      videos: [],
      title: '',
    }

    // if we already have it on the list, delete
    for (var i = playlists.length - 1; i >= 0; i--) {
      if(playlists[i].id === id){
        newEntry.title = playlists[i].title;
        playlists.splice(i, 1);
        break;
      }
    };

    _getPlaylistDetails(id, function(res){
      newEntry.videos = res.videos;
      newEntry.content = _artistsToContent(res.artists, res.videos);

      playlists.unshift(newEntry);

      chrome.storage.local.set({
        "playlists": playlists
      });

    })
  });
}

function _getPlaylistId(url){
  var split = url.match(/great\.dj\/(\w+)(?:$|#)/);
  if(split) return split[1];
}

function _getPlaylistDetails(id, callback){
  console.log('_getPlaylistDetails');
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://great.dj/details?id="+id, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var resp = JSON.parse(xhr.responseText);
      callback(resp.data);
    }
  }
  xhr.send();
}

function _artistsToContent(artists, pl){
  var names = artists.slice(0, 3).map(function(artist){ return artist.name; });
  return pl.length + ' songs, including ' + names.join(', ');
}



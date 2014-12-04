chrome.webNavigation.onHistoryStateUpdated.addListener(function(details){
  savePlaylist(details.url);
}, {url: [{hostSuffix: "great.dj"}]});

chrome.webNavigation.onCompleted.addListener(function(details){
  savePlaylist(details.url);
}, {url: [{hostSuffix: "great.dj"}]});

//

function getPlaylistId(url){
  var split = url.split('/');
  return split[3];
}

function savePlaylist(url){
  var id = getPlaylistId(url);

  if(id){
    chrome.storage.local.get({
      "playlists": [],
    }, function(storage) {
      var playlists = storage.playlists;

      var newPlaylists = [];
      playlists.forEach(function(pl){
        if(pl.id !== id){
          newPlaylists.push(pl);
        }
      });

      newPlaylists.push({
        id: id,
        link: url,
        lastDate: new Date().getTime()
      });

      newPlaylists.sort(function(a, b){ return (a.lastDate || 1) < (b.lastDate || 0); });

      chrome.storage.local.set({
        "playlists": newPlaylists
      });

    });
  }
}

self.addEventListener('install', function (event) {
  var indexPage = new Request('index.html');
  event.waitUntil(
    fetch(indexPage).then(function (response) {
      caches.open('pwabuilder-offline').then(function (cache) {
        console.log('[PWA Builder] Cached index page during Install' + response.url);
        return cache.addAll([
          '/index.html',
          'css/estilo.css',
          'images/icons/icon-72x72.png',
          'images/icons/icon-96x96.png',
          'images/icons/icon-128x128.png',
          'images/icons/icon-144x144.png',
          'images/icons/icon-152x152.png',
          'images/icons/icon-192x192.png',
          'images/icons/icon-384x384.png',
          'images/icons/icon-512x512.png',
          'js/jquery.min.js',
          'js/mapa.js',
          '/manifest.json'
        ]);
      });
    })
  );
});


//If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener('fetch', function (event) {
  var updateCache = function (request) {
    return caches.open('pwabuilder-offline').then(function (cache) {
      return fetch(request).then(function (response) {
        console.log('[PWA Builder] add page to offline' + response.url)
        return cache.put(request, response);
      });
    });
  };

  event.waitUntil(updateCache(event.request));

  event.respondWith(
    fetch(event.request).catch(function (error) {
      console.log('[PWA Builder] Network request Failed. Serving content from cache: ' + error);

      //Check to see if you have it in the cache
      //Return response
      //If not in the cache, then return error page
      return caches.open('pwabuilder-offline').then(function (cache) {
        return cache.match(event.request).then(function (matching) {
          var report = !matching || matching.status == 404 ? Promise.reject('no-match') : matching;
          return report
        });
      });
    })
  );
})



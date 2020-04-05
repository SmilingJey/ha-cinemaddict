/* eslint-disable max-nested-callbacks */
/* eslint-disable indent */
/* eslint-disable no-console */

const CACHE_NAME = `CINEMAADDICT`;

function cacheFiles(cache) {
  return cache.addAll([
    `./`,
    `./index.html`,
    `./bundle.js`,
    `./css/normalize.css`,
    `./css/main.css`,
    `./css/toastr.min.css`,
    `./img/posters/accused.jpg`,
    `./img/posters/blackmail.jpg`,
    `./img/posters/blue-blazes.jpg`,
    `./img/posters/fuga-da-new-york.jpg`,
    `./img/posters/moonrise.jpg`,
    `./img/posters/three-friends.jpg`,
    `./img/background.png`,
    `./img/icon-favorite.png`,
    `./img/icon-favorite.svg`,
    `./img/icon-watched.png`,
    `./img/icon-watched.svg`,
    `./img/icon-watchlist.png`,
    `./img/icon-watchlist.svg`,
  ]);
}

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cacheFiles)
      .catch((err) => {
        console.error(err);
        throw err;
      })
    );
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        return response ? response : fetch(evt.request);
      })
      .catch((err) => {
        console.error(err);
        throw err;
      })
  );
});

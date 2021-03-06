// service-worker.js

// set names for both precache & runtime cache
workbox.core.setCacheNameDetails({
    prefix: 'borisschapira-com',
    suffix: 'f935e82b',
    precache: 'precache',
    runtime: 'runtime-cache'
});

// let Service Worker take control of pages ASAP
workbox.skipWaiting();
workbox.clientsClaim();

// let Workbox handle our precache list
workbox.precaching.precacheAndRoute(self.__precacheManifest);

// use `networkFirst` strategy for `*.html`, like all my posts
workbox.routing.registerRoute(
    /\.html$/,
    workbox.strategies.networkFirst()
);

// use `cacheFirst` strategy for images and fonts
workbox.routing.registerRoute(
    /assets\/(images|fonts)/,
    workbox.strategies.cacheFirst()
);

let currentCacheNames = Object.assign({
        precacheTemp: workbox.core.cacheNames.precache + "-temp"
    },
    workbox.core.cacheNames
);

// clean up old SW caches
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            let validCacheSet = new Set(Object.values(currentCacheNames));
            return Promise.all(
                cacheNames
                .filter(function (cacheName) {
                    return !validCacheSet.has(cacheName);
                })
                .map(function (cacheName) {
                    console.log("deleting cache", cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
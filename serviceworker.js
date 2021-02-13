let cacheName = "To-Do-App";
let urlToCache = [
	'/',
	'/index.html',
	'/css/styles.css',
	'/js/script.js'
];

/* Start the service worker and cache all the contents of the app */
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(cacheName).then(function(cache) {
			return cache.addAll(urlToCache);
		})
	);
});

/* Fetch cached content when offline */
self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if(response) {
				return response;
			}
			return fetch(event.request);
		})
	);
});
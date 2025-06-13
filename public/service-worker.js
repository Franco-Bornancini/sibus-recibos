self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('sibus-cache').then((cache) => {
        return cache.addAll([
            '/',
            '/LogoChico.png',
            '/index.html',
            '/manifest.json'
            ]);
        })
    );
});
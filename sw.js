const CACHE_NAME = 'flower-shop-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    'index.html',
    'style.css',
    '/app.js',
    'video1.mp4',
    '/video2.mp4',
    '/favicon.ico'
];

// Install Event - Cache assets
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching assets...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch Event - Serve cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => caches.match('/offline.html'))
    );
});

// Push Event - Handle push notifications
self.addEventListener('push', event => {
    let data = event.data ? event.data.json() : {};
    const title = data.title || 'New Promotion!';
    const options = {
        body: data.body || 'Check out our latest flower arrangements!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: data.url || '/'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click Event - Open the related URL
self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.notification.data) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});

// Check if the browser supports Service Workers
if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
                subscribeUserToPush(registration);
            })
            .catch(error => console.error('Service Worker registration failed:', error));
    });
}

// Function to subscribe user to push notifications
async function subscribeUserToPush(registration) {
    try {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: '<YOUR_PUBLIC_VAPID_KEY>'
        });
        console.log('Push subscription successful:', subscription);
    } catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
    }
}

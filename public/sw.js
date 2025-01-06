self.addEventListener('push', function (event) {
  if (!event.data) {
    console.error('Push event but no data!');
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.');

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === 'https://musica-steel.vercel.app' && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('https://musica-steel.vercel.app');
    })
  );
});

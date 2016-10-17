self.addEventListener('install', function(event) {
});
self.addEventListener('activate', function(event) {
});
self.addEventListener('push', function(event) {
  fetch('/web/pushNotify', {
            method: 'GET',
            credentials: 'include'
        })['catch'](function() {})
    .then(function(res) {
      return res.json();
    }).then(function(json) {
        self.registration.showNotification(json.title, json.options);
    });
});
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = clickUrl;
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
          return clients.openWindow(url);
      }
    })
  );
},false);
self.addEventListener("notificationclose", function(event){

});
self.addEventListener("pushsubscriptionchange", function(event) {
  if(Notification && Notification.permission==="granted"){
      //event.waitUntil(new WebPushHandler().subscribe());
  }
});
var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Analytics = function() {
    function Analytics() { _classCallCheck(this, Analytics); }
    _createClass(Analytics, [{
        key: 'trackEvent',
        value: function trackEvent(eventAction, eventValue, optionalParams) {
            var _this = this;
            if (!this.trackingId) {
                console.error('You need to set a trackingId');
                return Promise.resolve();
            }
            if (typeof eventAction === 'undefined' && typeof eventValue === 'undefined') {
                console.warn('sendAnalyticsEvent() called with no eventAction or ' + 'eventValue.');
                return Promise.resolve();
            }
            var payloadData = { v: 1, cid: _this.clientId, tid: _this.trackingId, t: 'event', ds: 'serviceworker', ec: 'serviceworker', ea: eventAction, ev: eventValue };
            if (optionalParams) { Object.keys(optionalParams).forEach(function(key) { payloadData[key] = optionalParams[key]; }); }
            var payloadString = Object.keys(payloadData).filter(function(analyticsKey) {
                return payloadData[analyticsKey];
            }).map(function(analyticsKey) {
                return analyticsKey + '=' + encodeURIComponent(payloadData[analyticsKey]);
            }).join('&');
            fetch('https://www.google-analytics.com/collect', { method: 'post', body: payloadString });
        }
    }]);
    return Analytics;
}();
if (typeof self !== 'undefined') {
    self.analytics = new Analytics();
}
var fetchUrl = "./response.json";
self.analytics.trackingId = 'UA-123456-1';
self.analytics.clientId = "0941313001485263664-A56C49F0AECA-BC12B8456CD2";
self.addEventListener('install', function(event) {
    console.log('installed');
});
self.addEventListener('activate', function(event) {
    console.log('actvated');
});
self.addEventListener('push', function(event) {
    event.waitUntil(fetch(fetchUrl, {
            method: 'GET',
            body: { appId: 108 },
            credentials: 'include'
        })
        .catch(function() {
            self.analytics.trackEvent('fetch', 'fetch-404');
        })
        .then(function(res) {
            return res.json();
        })
        .then(function(json) {
            self.analytics.trackEvent('push', 'push-received');
            return self.registration.showNotification(json.title, {
                body: json.body,
                icon: json.icon,
                data: { clickUrl: json.clickUrl },
                actions: [{ action: "viewAll", title: "View All" }]
            });
        }));
});
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var url = event.notification.data.clickUrl;
    event.waitUntil(clients.matchAll({ type: 'window' }).then(function(windowClients) {
        for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            if (client.url === url && 'focus' in client) {
                return client.focus();
            }
        }
        if (clients.openWindow) {
            return clients.openWindow(url);
        }
        self.analytics.trackEvent('click', 'notification-click');
    }));
}, false);
self.addEventListener("notificationclose", function(event) {
    console.log('notification-closed');
    self.analytics.trackEvent('click', 'notification-close');
});
self.addEventListener("pushsubscriptionchange", function(event) {
    console.log('subscription-changed');
    self.analytics.trackEvent('pushsubscribechange', 'subscription-changed');
});

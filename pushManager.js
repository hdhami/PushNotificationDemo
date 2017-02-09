var WebPushHandler = function(serviceWorkerPath) {
    var _this = this;
    _this.hasSubscription = false;
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(serviceWorkerPath)
            .then(function() {
                _this.initNotification();
            }).catch(function(error) {
                throw new Error('registration failed :' + error);
            });
    }
};
WebPushHandler.prototype.initNotification = function(toBeSubscribed) {
    var _this = this;
    // check support for service worker 
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        throw new Error('Notifications aren\'t supported.');
    } else if (Notification.permission === 'denied') {
        _this.trackBlockNotification();
        throw new Error('User has blocked notifications.');
    } else if (!('PushManager' in window)) {
        throw new Error('Push messaging isn\'t supported.');
    } else {
        if (toBeSubscribed) {
            this.subscribe();
        } else {
            this.isSubscribed();
        }

    }
};
WebPushHandler.prototype.subscribe = function() {
    var _this = this;
    navigator.serviceWorker.ready.then(function(registration) {
        registration.pushManager.subscribe({ userVisibleOnly: true })
            .then(function(subscription) {
                var regId = _this.getRegistrationId(subscription);
                _this.saveRegistrationId(regId);
                _this.trackSubscription();
            })
            .catch(function(e) {
                if (Notification.permission === 'denied') {
                    throw new Error('Permission for Notifications was denied'+e);
                } else {
                    throw new Error(e);
                }
            });
    });
};
WebPushHandler.prototype.isSubscribed = function() {
    var _this = this;
    navigator.serviceWorker.ready.then(function(registration) {
        registration.pushManager.getSubscription().
        then(function(subscription) {
                console.log(subscription);
                if (subscription) {
                    _this.hasSubscription = true;
                } else {
                    console.log('else');
                    _this.initCustomPopup();
                    _this.hasSubscription = false;
                }
            })
            .catch(function(e) {
                if (Notification.permission === 'denied') {} else {}
            });
    });
};
WebPushHandler.prototype.getRegistrationId = function(pushSubscription) {
    if (pushSubscription.subscriptionId) {
        return pushSubscription.subscriptionId;
    } else {
        return pushSubscription.endpoint;
    }
};
WebPushHandler.prototype.saveRegistrationId = function(endpoint) {
    return fetch('/web/pushRegister', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'X-IsAjaxForm': '1'
        }),
        body: {
            endpoint:endpoint
        },
        credentials: 'include'
    })['catch'](function() {});
};
WebPushHandler.prototype.initCustomPopup = function() {
    var _this = this;
    $('body').append('<div class="pushLtBox"><div id="pushPopup" class="pushPrompt"><div><p class="caption">Get Notified for New Things</p><p class="desc">You can turn them off anytime time from browser settings</p></div><span id="block" class="fr pushBtn later">Later</span><span id="allow" class="fr pushBtn sure">Sure</span></div></div>');
    setTimeout(function() {
        $('.pushLtBox').addClass('animate');
    }, 10);
    _this.bindEvents();
};
WebPushHandler.prototype.bindEvents = function() {
    var _this = this,
        $popupCont = $('#pushPopup');
    $popupCont.on('click', '#allow', function() {
        $('.pushLtBox').hide();
        _this.initNotification(true);
        
    });
    $popupCont.on('click', '#block', function() {
        $('.pushLtBox').hide();
        _this.trackNotifyMeLater();
        
    });
};
WebPushHandler.prototype.trackSubscription = function() {
    try {
        
    } catch (err) {
        throw new Error(err);
    }
};
WebPushHandler.prototype.trackBlockNotification = function() {
    try {
       
    } catch (err) {
        throw new Error(err);
    }

};
WebPushHandler.prototype.trackNotifyMeLater = function() {
    try {
        
    } catch (err) {
        throw new Error(err);
    }

};

window.addEventListener('load', function() {
    // check if current browser is Chrome
    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    if (('serviceWorker' in navigator) && isChrome) {
        var pushObj = new WebPushHandler('./sw.js');        
    }
});

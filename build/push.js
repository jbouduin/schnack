'use strict';

/* globals btoa, fetch, Notification */
// Vapid public key.
var applicationServerPublicKey = '%VAPID_PUBLIC_KEY%';
var schnack_host = '%SCHNACK_HOST%';

var serviceWorkerName = '/sw.js';

(function() {
    Notification.requestPermission().then(function(status) {
        if (status === 'granted') {
            initialiseServiceWorker();
        }
    });
})();

function initialiseServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register(serviceWorkerName)
            .then(handleSWRegistration)
            .catch(function (err) { return console.error(err); });
    } else {
        console.error("Service workers aren't supported in this browser.");
    }
}

function handleSWRegistration(reg) {
    initialiseState(reg);
}

// Once the service worker is registered set the initial state
function initialiseState(reg) {
    // Are Notifications supported in the service worker?
    if (!reg.showNotification) {
        console.error("Notifications aren't supported on service workers.");
        return;
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
        console.error("Push messaging isn't supported.");
        return;
    }

    // We need the service worker registration to check for a subscription
    navigator.serviceWorker.ready.then(function(reg) {
        // Do we already have a push message subscription?
        reg.pushManager
            .getSubscription()
            .then(function (subscription) {
                if (!subscription) {
                    subscribe();
                } else {
                    // initialize status, which includes setting UI elements for subscribed status
                    // and updating Subscribers list via push

                }
            })
            .catch(function (err) {
                console.error('Error during getSubscription()', err);
            });
    });
}

function subscribe() {
    navigator.serviceWorker.ready.then(function(reg) {
        var subscribeParams = { userVisibleOnly: true };

        // Setting the public key of our VAPID key pair.
        var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
        subscribeParams.applicationServerKey = applicationServerKey;

        reg.pushManager
            .subscribe(subscribeParams)
            .then(function (subscription) {
                // Update status to subscribe current user on server, and to let
                // other users know this user has subscribed
                var endpoint = subscription.endpoint;
                var key = subscription.getKey('p256dh');
                var auth = subscription.getKey('auth');
                sendSubscriptionToServer(endpoint, key, auth);

            })
            .catch(function (err) {
                // A problem occurred with the subscription.
                console.error('Unable to subscribe to push.', err);
            });
    });
}

function sendSubscriptionToServer(endpoint, key, auth) {
    var encodedKey = btoa(String.fromCharCode.apply(null, new Uint8Array(key)));
    var encodedAuth = btoa(String.fromCharCode.apply(null, new Uint8Array(auth)));

    fetch(schnack_host + '/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey: encodedKey, auth: encodedAuth, endpoint: endpoint })
    }).then(function (res) {
        console.log('Subscribed successfully! ' + JSON.stringify(res));
    });
}

function urlB64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

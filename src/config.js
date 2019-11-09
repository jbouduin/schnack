const nconf = require('nconf');
const crypto = require('crypto');
const webpush = require('web-push');

// VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

nconf
    .defaults({
        notify: {
            webpush: {
                vapid_public_key: vapidKeys.publicKey,
                vapid_private_key: vapidKeys.privateKey
            }
        }
    });

module.exports = nconf;

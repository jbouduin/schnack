const fs = require('fs');
const { URL } = require('url');
const queries = require('./db/queries');
const config = require('./config');

function send_file(file, admin_only) {
    return send_string(fs.readFileSync(file, 'utf-8'), admin_only);
}

function send_string(body, admin_only) {
    return function(request, reply, next) {
        if (admin_only) {
            const user = getUser(request) || {};
            if (!user.admin) return next();
        }
        if (request.baseUrl.endsWith('.js')) {
            reply.header('Content-Type', 'application/javascript');
        }
        reply.send(body);
    };
}

function error(err, request, reply, code) {
    if (err) {
        console.error(err.message);
        reply.status(code || 500).send({ error: err.message });

        return true;
    }

    return false;
}

function checkOrigin(origin, callback) {
    // origin is allowed
    if (
        typeof origin === 'undefined' ||
        `.${new URL(origin).hostname}`.endsWith(`.${schnack_domain}`)
    ) {
        return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
}

'use strict';
// use only if this matter isn't solved at downstream server [draft]
function accessControl(req, res, next) {
    if (req.method === 'OPTIONS' && req.server.accessControl.allowOrigins) {
        // check if request hostname is included
        if (req.server.accessControl.allowOrigins.includes(req.hostname)) {
            res.headers['Access-Control-Allow-Origin'] = req.hostname;
            res.sendStatus(204);
            return;
        } else {
            res.sendStatus(403);
            return;
        }
    }
    next();
}

module.exports = accessControl;

'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

const performanceTimer = require('../../dev-tools/performance-timer');
const consoleLogger = require('../../dev-tools/console-logger');

// sets req user if authorization header is present and valid
async function setUser(req, res, next) {
    req.performer = 'setUser';
    if (req.server.auth && req.server.auth.mode && req.headers.authorization) {
        // reject if tries relogin
        if (/\/auth/.test(req.path)) {
            return res.status(304).end();
        }
        // console.log(req.headers.authorization);
        let authHeader = req.headers.authorization.split(' ');
        if (authHeader[0] == 'Bearer') {
            try {
                // verify the token and set user claims
                req.user = req.server.auth.jwt.user(req, authHeader[1]);
                // check if user claims and permission recorded in db are in accordance with the required conditions
                if (req.user) {
                    // try to get access permission, if no error switch the token with the proxied host's token
                    const permission = await req.server.auth.jwt.permission(req);
                    // permission granted, so switch the token with the proxied host's token
                    // no check for expired upstream token, because there it will be checked anyway
                    req.headers['Authorization'] = 'Bearer ' + permission.token;
                }
            } catch (error) {
                next(error);
            }
        }
    }
    next();
}

router.use(consoleLogger, performanceTimer, setUser);

module.exports = router;

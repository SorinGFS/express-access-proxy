'use strict';
//
const fn = require('express-access-proxy-base/fn');
const slowDown = require('express-slow-down');

module.exports = {
    ip: slowDown({
        windowMs: 2 * 60 * 1000, // 2 minutes
        delayAfter: 500, // allow requests per windowMs, then...
        delayMs: 10, // begin adding delay per request above delayAfter
        skipSuccessfulRequests: false, // when true successful requests (response status < 400) won't be counted.
        skipFailedRequests: false, // when true failed requests (response status >= 400) won't be counted.
        onLimitReached: function (req, res, options) {},
        keyGenerator: function (req /*, res*/) {
            return req.ip; 
        },
        skip: function (req /*, res*/) {
            if (!req.server.slowDown) return true;
            if (req.server.slowDown.ip) {
                if (typeof req.server.slowDown.ip === 'object') {
                    fn.mergeDeep(this, req.server.slowDown.ip);
                } else {
                    return !req.server.slowDown.ip;
                }
            }
        },
    }),
    route: slowDown({
        windowMs: 2 * 60 * 1000, // 2 minutes
        delayAfter: 5, // allow requests per windowMs, then...
        delayMs: 1400, // begin adding delay per request above delayAfter
        skipSuccessfulRequests: false, // when true successful requests (response status < 400) won't be counted.
        skipFailedRequests: false, // when true failed requests (response status >= 400) won't be counted.
        onLimitReached: function (req, res, options) {},
        keyGenerator: function (req /*, res*/) {
            return req.ip + ':' + req.originalUrl; // this can be modified for more granular control
        },
        skip: function (req /*, res*/) {
            if (!req.server.slowDown) return true;
            if (req.server.slowDown.route) {
                if (typeof req.server.slowDown.route === 'object') {
                    fn.mergeDeep(this, req.server.slowDown.route);
                } else {
                    return !req.server.slowDown.route;
                }
            }
        },
    }),
};


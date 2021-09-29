'use strict';
//
const fn = require('express-access-proxy-base/fn');
const rateLimit = require('express-rate-limit');

module.exports = {
    ip: rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 1000, // limit each IP to max requests per windowMs // Default 5. Set 0 to disable
        headers: false, // Default true
        onLimitReached: function (req, res, options) {},
        keyGenerator: function (req /*, res*/) {
            return req.ip; // this can be modified for more granular control
        },
        statusCode: 429, // HTTP status code returned when max is exceeded.
        message: 'Too many requests from this IP.',
        skipSuccessfulRequests: false, // when true successful requests (response status < 400) won't be counted.
        skipFailedRequests: false, // when true failed requests (response status >= 400) won't be counted.
        skip: function (req /*, res*/) {
            if (!req.server.rateLimit) return true;
            if (req.server.rateLimit.ip) {
                if (typeof req.server.rateLimit.ip === 'object') {
                    fn.mergeDeep(this, req.server.rateLimit.ip);
                } else {
                    return !req.server.rateLimit.ip;
                }
            }
        },
    }),
    route: rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 10, // limit each IP to max requests per windowMs // Default 5. Set 0 to disable
        headers: false, // Default true
        onLimitReached: function (req, res, options) {},
        keyGenerator: function (req /*, res*/) {
            return req.ip + ':' + req.originalUrl; // this can be modified for more granular control
        },
        statusCode: 429, // HTTP status code returned when max is exceeded.
        message: 'Too many requests from this location.',
        skipSuccessfulRequests: false, // when true successful requests (response status < 400) won't be counted.
        skipFailedRequests: false, // when true failed requests (response status >= 400) won't be counted.
        skip: function (req /*, res*/) {
            if (!req.server.rateLimit) return true;
            if (req.server.rateLimit.route) {
                if (typeof req.server.rateLimit.route === 'object') {
                    fn.mergeDeep(this, req.server.rateLimit.route);
                } else {
                    return !req.server.rateLimit.route;
                }
            }
        },
    }),
};

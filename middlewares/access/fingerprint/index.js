'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();
// pasive fingerprinting to be used in conjunction with csrs to identify the request source
const fingerprint = require('./express-fingerprint');
const performanceTimer = require('../../dev-tools/performance-timer');
const consoleLogger = require('../../dev-tools/console-logger');

const useFingerprint = (req, res, next) => {
    req.performer = 'fingerprint';
    if (req.server.fingerprint) {
        // init fingerprint
        req.fingerprint = {};
        router.use(fingerprint(req.server.fingerprint));
    }
    next();
};

router.use(consoleLogger, performanceTimer, useFingerprint);
module.exports = router;

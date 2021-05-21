'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();
// pasive fingerprinting to be used in conjunction with csrs to identify the request source
const setServer = require('./server');
const performanceTimer = require('../../dev-tools/performance-timer');
const consoleLogger = require('../../dev-tools/console-logger');

router.use(consoleLogger, performanceTimer, setServer);
module.exports = router;
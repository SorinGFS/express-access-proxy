'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

const rateLimit = require('./rate-limit');
const slowDown = require('./slow-down');

// load spam protection
router.use(rateLimit.ip, slowDown.ip, rateLimit.route, slowDown.route);

module.exports = router;
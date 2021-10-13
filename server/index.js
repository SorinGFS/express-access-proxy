'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

const access = require('express-access-proxy-middlewares/access');
const bodyParsers = require('express-access-proxy-middlewares/body-parsers');
const spamProtection = require('express-access-proxy-middlewares/spam-protection');
const routes = require('./routes');
const proxy = require('./proxy');
const handleError = require('express-access-proxy-middlewares/http-errors');

router.use(access, spamProtection, bodyParsers, routes, proxy, handleError);

module.exports = router;

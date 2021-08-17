'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

const requestParsers = require('../middlewares/request-parsers');
const spamProtection = require('../middlewares/spam-protection');
const routes = require('./routes');
const access = require('../middlewares/access');
const proxy = require('../middlewares/proxy');
const handleError = require('../middlewares/http-errors');

router.use(requestParsers, access, spamProtection, routes, proxy, handleError);

module.exports = router;

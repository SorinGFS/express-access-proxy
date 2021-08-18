'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

const httpParsers = require('../middlewares/http-parsers');
const access = require('../middlewares/access');
const bodyParsers = require('../middlewares/body-parsers');
const spamProtection = require('../middlewares/spam-protection');
const routes = require('./routes');
const proxy = require('../middlewares/proxy');
const handleError = require('../middlewares/http-errors');

router.use(httpParsers, access, spamProtection, bodyParsers, routes, proxy, handleError);

module.exports = router;

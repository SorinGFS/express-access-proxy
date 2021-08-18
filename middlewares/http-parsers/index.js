'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

const httpLogger = require('./volleyball');
const cookieParser = require('./cookie-parser');

router.use(httpLogger, cookieParser)

module.exports = router;
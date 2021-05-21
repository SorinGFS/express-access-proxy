'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

const logger = require('volleyball');

// load logger for dev
if (process.env.NODE_ENV === 'development') {
    router.use(logger);
}

module.exports = router;
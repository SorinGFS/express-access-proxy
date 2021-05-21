'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

const httpLogger = require('./volleyball');
const methodOverride = require('./method-override');
const cookieParser = require('./cookie-parser');
const bodyFormsParser = require('./body-forms-parser');

router.use(httpLogger, methodOverride, cookieParser /*, bodyFormsParser */)

module.exports = router;
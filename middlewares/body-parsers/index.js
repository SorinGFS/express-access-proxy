'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

const parseForm = require('./parse-form');
const parseJson = require('./parse-json');
const parseText = require('./parse-text');
const methodOverride = require('./method-override');

router.use(parseForm, parseJson, parseText, methodOverride)

module.exports = router;
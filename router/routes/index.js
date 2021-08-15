'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();
const fs = require('../../base/fs');

fs.dirs(__dirname).forEach((route) => router.use(`/${route}`, require(`./${route}`)));

module.exports = router;

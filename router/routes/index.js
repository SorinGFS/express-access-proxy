'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();
const fs = require('../../base/fs');

const routes = [];
fs.dirs(__dirname).forEach((route) => routes.push(require(`./${route}`)));

router.use(...routes);

module.exports = router;

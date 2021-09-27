'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

const cookieParser = require('cookie-parser');
// parse cookies
router.use(cookieParser(process.env.COOKIE_SECRET));

module.exports = router;
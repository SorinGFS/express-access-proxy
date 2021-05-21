'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

// parse http body forms (if enabled ensure csrfProtection fit the change)
router.use(require('express').urlencoded({ extended: false }));

module.exports = router;
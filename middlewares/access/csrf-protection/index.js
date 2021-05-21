'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();
// pasive fingerprinting to be used in conjunction with csrs to identify the request source
const csurf = require('./csurf');

const useCsrfProtection = (req, res, next) => {
    if (req.server.csrfProtection) {
        router.use(csurf);
    }
    next();
};

router.use(useCsrfProtection);
module.exports = router;
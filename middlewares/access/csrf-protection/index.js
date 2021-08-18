'use strict';
// pasive fingerprinting to be used in conjunction with csrs to identify the request source
const csurf = require('./csurf');

const csrfProtection = (req, res, next) => {
    if (req.server.csrfProtection) {
        csurf(req, res, next);
    } else {
        next();
    }
};

module.exports = csrfProtection;
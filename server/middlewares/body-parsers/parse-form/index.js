'use strict';
// parse form
const parseForm = require('express').urlencoded({ extended: false });
// parse http body forms (if enabled ensure csrfProtection fit the change)
const useParseForm = (req, res, next) => {
    if (req.server.parseForm) {
        parseForm(req, res, next);
    } else {
        next();
    }
};

module.exports = useParseForm;

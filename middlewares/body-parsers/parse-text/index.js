'use strict';
// parse text
const parseText = require('express').text();
// parse http body with text payload
const useParseText = (req, res, next) => {
    if (req.server.parseText) {
        parseText(req, res, next);
    } else {
        next();
    }
};

module.exports = useParseText;
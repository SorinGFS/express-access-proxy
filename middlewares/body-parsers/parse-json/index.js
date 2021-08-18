'use strict';
// parse json
const parseJson = require('express').json();
// parse http body Json
const useParseJson = (req, res, next) => {
    if (req.server.parseJson) {
        parseJson(req, res, next);
    } else {
        next();
    }
};

module.exports = useParseJson;

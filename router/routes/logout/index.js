'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();
const createError = require('http-errors');

function logout(req, res, next) {
    if (req.method !== 'POST') return next(createError.MethodNotAllowed());
    if (req.user) {
        try {
            req.server.auth.jwt.logout(req);
            return next(createError.Unauthorized());
        } catch (error) {
            return next(error);
        }
    }
    return next(createError.BadRequest());
}

router.all('/logout', logout);

module.exports = router;

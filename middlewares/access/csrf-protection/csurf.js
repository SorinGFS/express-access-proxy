'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();
// if the token secret is provided then that key it will be used to generate new token, otherwise new secret is sent
const csurf = require('csurf');
// we don't use secure cookie in development since most of the time we use localhost or lan without https
// default cookie.key _csrf renamed csrs is the token secret, not the token
const csrfProtection = csurf({ cookie: { key: 'csrs', secure: process.env.NODE_ENV === 'production', httpOnly: true, sameSite: true }, value: customValue });
// cookies with sameSite Lax or Strict DOES solve the csrf problem, but keep in mind:
// ############ cookies are NOT encrypted under the HTTPS protocol ############
// so, for best security cookies can be signed and they will automatically be decrypted by the cookie-parser middleware
// the place where csrfProtection looks for the token, if frontend validation is desired set csrtHeader in server csrfProtection configuration (also ensure that the frontend passes the cookie to that header)
function customValue(req) {
    if (req.server.csrfProtection.csrtHeader) {
        return req.headers[req.server.csrfProtection.csrtHeader];
    } else {
        return req.cookies['csrt'];
    }
}
// if csrfProtection passed here means that request method is allowed in ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
function setInitialCsrfToken(req, res, next) {
    if (req.method === 'GET') {
        // if req.server.csrfProtection.csrtHeader the frontend must copy the value in the specified header and may remove the cookie['csrt']
        res.cookie('csrt', req.csrfToken(), { secure: process.env.NODE_ENV === 'production', httpOnly: !req.server.csrfProtection.csrtHeader, sameSite: true });
    }
    next();
}

router.use(csrfProtection, setInitialCsrfToken);

module.exports = router;

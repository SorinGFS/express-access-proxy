'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();

const fs = require('express-access-proxy-base/fs');
const expressProxy = require('express-http-proxy');

// if auth.provider not defined will result a transparent proxy to the proxyPass host
function proxy(req, res, next) {
    const proxyOptions = () => {
        try {
            return require(fs.pathResolve(__dirname, req.server.auth.provider.name));
        } catch (error) {
            return {};
        }
    };
    const proxy = expressProxy((req) => req.server.proxyPass, proxyOptions());
    router.use(proxy);
    next();
}

router.use(proxy);

module.exports = router;

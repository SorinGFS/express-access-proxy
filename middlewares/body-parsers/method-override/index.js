'use strict';
// method override
const methodOverride = require('method-override')('method');
// parse http body forms (if enabled ensure csrfProtection fit the change)
const useMethodOverride = (req, res, next) => {
    if (req.server.methodOverride) {
        methodOverride(req, res, next);
    } else {
        next();
    }
};

module.exports = useMethodOverride;

'use strict';
// display middleware modified vars requested in server config
const fn = require('express-access-proxy-base/fn');
function consoleLogger(req, res, next) {
    // the results will be taken AFTER middleware run
    next();
    if (process.env.NODE_ENV === 'development' && req.server && req.server.devTools && req.server.devTools.consoleLogger) {
        Object.keys(req.server.devTools.consoleLogger).forEach((middleware) => {
            if (middleware === req.performer) {
                console.log(`Console Logger: =========== request after [${req.performer}] ===========`);
                req.server.devTools.consoleLogger[middleware].forEach((item) => {
                    console.log(`req.${item}:`, fn.get(req, item));
                });
            }
        });
    }
}

module.exports = consoleLogger;

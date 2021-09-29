'use strict';
// performance timer for running middlewares
const fn = require('express-access-proxy-base/fn');

const performanceTimer = (req, res, next) => {
    if (process.env.NODE_ENV === 'development' && req.server && req.server.devTools && req.server.devTools.performanceTimer) {
        let start = fn.microtime(true);
        next();
        let end = fn.microtime(true);
        req.server.devTools.performanceTimer.forEach((middleware) => {
            if (middleware === req.performer) {
                console.log(`Performance Timer: [${req.performer} <—> ${Math.round((end - start) * 1000.0)}ms]`);
            }
        });
    } else {
        next();
    }
};

module.exports = performanceTimer;

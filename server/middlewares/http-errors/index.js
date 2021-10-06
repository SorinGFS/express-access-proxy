'use strict';
// this is a custom handler
const handleError = (err, req, res, next) => {
    const { statusCode = 500, expose, message, stack, headers, ...rest } = err;
    if (headers) res.set(headers);
    if (!expose && message) console.log(message, stack);
    if (!expose) return res.status(statusCode).end();
    return res.status(statusCode).json({ statusCode, message, ...rest });
};

module.exports = handleError;

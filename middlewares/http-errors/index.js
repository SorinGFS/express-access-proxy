'use strict';

const handleError = (err, req, res, next) => {
    const { statusCode = 500, expose, message, stack, ...rest } = err;
    if (!expose && stack && message) console.log(message, stack);
    if (!expose && message) console.log(message);
    if (!expose) return res.status(500).end();
    return res.status(statusCode).json({
        statusCode,
        message,
        ...rest,
    });
};

module.exports = handleError;

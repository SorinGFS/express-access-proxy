'use strict';

const handleError = (err, req, res, next) => {
    const { statusCode = 500, expose, message, ...rest } = err;
    if (!expose && message) console.log(message);
    if (!expose) return res.status(500).end();
    return res.status(statusCode).json({
        statusCode,
        message,
        ...rest,
    });
};

module.exports = handleError;

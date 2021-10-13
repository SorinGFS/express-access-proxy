'use strict';
// this is a body parser that passes the body to the req.site as is or according to a schema
const dataAdapter = (req, res, next) => {
    if (req.server.dataAdapter && req.body && !Array.isArray(req.body)) {
        if (typeof req.server.dataAdapter === 'boolean') {
            Object.keys(req.body).forEach((key) => {
                if (key !== 'body' && typeof req.body[key] === 'object' && !Array.isArray(req.body[key])) {
                    if (!req.site[key]) req.site[key] = {};
                    Object.assign(req.site[key], req.body[key]);
                }
            });
            if (req.site.dbConnection) {
                if (!req.dbConnection) req.dbConnection = {};
                Object.assign(req.dbConnection, req.site.dbConnection);
                delete req.site.dbConnection;
            }
        } else {
            Object.keys(req.server.dataAdapter).forEach((key) => {
                if (typeof req.server.dataAdapter[key] === 'object' && !Array.isArray(req.server.dataAdapter[key])) {
                    Object.keys(req.server.dataAdapter[key]).forEach((subkey) => {
                        if (typeof req.server.dataAdapter[key][subkey] === 'string') req.server.dataAdapter[key][subkey] = [req.server.dataAdapter[key][subkey]];
                        if (Array.isArray(req.server.dataAdapter[key][subkey])) {
                            req.server.dataAdapter[key][subkey].forEach((item) => {
                                if (Object.keys(req.body).includes(item)) {
                                    if (key !== 'body' && typeof req.body[item] === 'object' && !Array.isArray(req.body[item])) {
                                        if (!req[key]) req[key] = {};
                                        if (!req[key][subkey]) req[key][subkey] = {};
                                        Object.assign(req[key][subkey], req.body[item]);
                                    }
                                }
                            });
                        }
                    });
                } else {
                    if (typeof req.server.dataAdapter[key] === 'string') req.server.dataAdapter[key] = [req.server.dataAdapter[key]];
                    if (Array.isArray(req.server.dataAdapter[key])) {
                        req.server.dataAdapter[key].forEach((item) => {
                            if (Object.keys(req.body).includes(item)) {
                                if (key !== 'body' && typeof req.body[item] === 'object' && !Array.isArray(req.body[item])) {
                                    if (!req[key]) req[key] = {};
                                    Object.assign(req[key], req.body[item]);
                                }
                            }
                        });
                    }
                }
            });
        }
        // for every case req.body.body was avoided, if such key exists it will replace the actual req.body
        if (req.body.body) req.body = req.body.body;
    }
    next();
};

module.exports = dataAdapter;

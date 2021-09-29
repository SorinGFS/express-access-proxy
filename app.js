'use strict';
// set req server to be used in middlewares
const env = require('./config/env');
const app = require('express')();
const fn = require('express-access-proxy-base/fn');
const filter = () => true; // filter all
const configs = require('./config/servers')(filter);
const servers = require('express-access-proxy-base/servers')(configs);
const server = require('./server');
// set port
const PORT = process.env.PORT || 7331;
// app listen
app.listen(PORT, console.log(`App running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`));
// select server based on request hostname and paste it to the request
function setServer(req, res, next) {
    // using the serialized serverName in base servers
    req.server = servers[Object.keys(servers).filter((name) => new RegExp(fn.btoa(`<${req.hostname}>`)).test(name))[0]];
    if (!req.server) throw new Error(`There is no configured serverName that matches ${req.hostname}`);
    // combine server and location rules
    if (req.server.locations) {
        req.server.locations.some((location) => {
            Object.keys(location).some((path) => {
                if (new RegExp(path).test(req.path)) {
                    req.server = fn.mergeDeep({}, req.server, location[path]);
                }
            });
        });
    }
    // app settings
    if (req.server.appSettings) {
        Object.keys(req.server.appSettings).forEach((key) => {
            app.set(key, req.server.appSettings[key]);
        });
    }
    // access db connection (if auth is set)
    if (req.server.auth && req.server.auth.mode) {
        const connection = require('./config/connections')((config) => config.dbName === 'access')[0];
        if (!connection) throw new Error(`Error: <access> db connection config not found!`);
        connection.namespace = 'access.permissions';
        req.server.Permissions = require('express-access-proxy-base/db/model')(connection);
    }
    next();
}

app.use(setServer, server);

module.exports = app;

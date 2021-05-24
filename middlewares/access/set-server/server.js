'use strict';
// set req server to be used in middlewares
const fn = require('../../../base/functions');
const servers = require('../../../base/servers');

function setServer(req, res, next) {
    req.performer = 'setServer';
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
    next();
}

module.exports = setServer;

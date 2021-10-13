'use strict';
// set req server to be used in middlewares
const env = require('./config/env');
const app = require('express')();
const fn = require('express-access-proxy-base/fn');
const accessDb = require('./config/connections')((config) => config.database === 'access')[0];
const configs = require('./config/servers')(() => true); // filter all
const servers = require('express-access-proxy-base/servers')(configs);
const httpParsers = require('express-access-proxy-middlewares/http-parsers');
const server = require('./server');
// set app
app.set('query parser', false);
app.set('x-powered-by', false);
// set port
const PORT = process.env.PORT || 7331;
// app listen
app.listen(PORT, console.log(`App running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`));
// select server based on request hostname and paste it to the request
function setServer(req, res, next) {
    // using the serialized serverName in base servers
    req.server = servers[Object.keys(servers).filter((name) => new RegExp(fn.btoa(`<${req.hostname}>`)).test(name))[0]];
    if (!req.server) throw new Error(`There is no configured serverName that matches ${req.hostname}`);
    // rewrite at server level
    if (req.server.urlRewrite) req.server.rewrite(req, req.server.urlRewrite);
    // parse locations (also rewrite at location level if any)
    req.server.parseLocations(req);
    // send direct response if this resulted from the parsed configuration
    if (req.sendStatus) return req.server.send(req, res);
    // apply app settings after the server has been combined with the location config
    if (req.server.appSettings) Object.keys(req.server.appSettings).forEach((key) => app.set(key, req.server.appSettings[key]));
    // set access db connection (for the access permissions managed by this app).
    if (req.server.auth && req.server.auth.mode) req.server.setAccessDb(req, accessDb);
    // init site with server defaults if any. This object will hold only frontend shareable vars.
    req.site = Object.assign({}, req.server.site);
    next();
}
// load the settings then pass the request to main server router
app.use(httpParsers, setServer, server);
// in an uncertain future we may run each server in a separate process by passing its config to this app
module.exports = app;

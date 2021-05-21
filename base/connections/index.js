'use strict';
// this returns the connection object used by dynamic model to connect
module.exports = (query) => {
    const { dbName, ...params } = query;
    const filterDbName = (config) => (config.dbName = dbName);
    const connection = require('../../config/connections')(filterDbName)[0];
    const filterConnector = (config) => (config.connector = connection.connector);
    const connector = require('../../config/connectors')(filterConnector)[0];
    const args = Object.assign(connection, connector, params);
    return require(`./${connection.connector}`)(args);
};

'use strict';
// this returns the connection object used by dynamic model to connect
module.exports = (namespace) => {
    const filterDbName = (config) => (config.dbName = namespace.split('.')[0]);
    const connection = require('../../config/connections')(filterDbName)[0];
    const filterConnector = (config) => (config.connector = connection.connector);
    const connector = require('../../config/connectors')(filterConnector)[0];
    const args = Object.assign(connection, connector, { namespace: namespace });
    return require(`./${connection.connector}`)(args);
};

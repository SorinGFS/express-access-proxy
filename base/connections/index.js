'use strict';
// this returns the connection object used by dynamic model to connect
module.exports = (namespace) => {
    const filterDbName = (config) => (config.dbName === namespace.split('.')[0]);
    const connection = require('../../config/connections')(filterDbName)[0];
    if (!connection) throw new Error(`${namespace} connection config not found!`);
    const args = Object.assign(connection, { namespace: namespace });
    return require(`./${connection.connector}`)(args);
};

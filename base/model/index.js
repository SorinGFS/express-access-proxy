'use strict';
// dynamic model is connector specific, custom model is extending base model and is dbName specific
// connection object must contain all the connector specific needs
module.exports = (namespace) => {
    const connection = require('../connections')(namespace);
    const BaseModel = require(`./${connection.connector}`);
    class Model extends BaseModel {
        constructor(connection) {
            super(connection);
        }
    }
    return new Model(connection);
};

'use strict';
// http://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html#.connect
const { MongoClient, ObjectID } = require('mongodb');

async function connect({ uri, dbName, options }) {
    try {
        const client = await new MongoClient.connect(uri, options);
        if (process.env.NODE_ENV === 'development' && client.isConnected()) {
            console.log(`Connected MongoDB: ${uri} database:${dbName}`);
        }
        const db = client.db(dbName);
        return { db, client, ObjectID };
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connect;

'use strict';
// https://docs.mongodb.com/drivers/node/v4.0/fundamentals/connection/
const { MongoClient, ObjectID } = require('mongodb');

async function connect({ uri, dbName, options }) {
    try {
        const client = new MongoClient(uri, options);
        await client.connect();
        const db = client.db(dbName);
        if (process.env.NODE_ENV === 'development') {
            await db.command({ ping: 1 });
            console.log(`Connected MongoDB: ${uri} database:${dbName}`);
        }
        return { db, client, ObjectID };
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connect;

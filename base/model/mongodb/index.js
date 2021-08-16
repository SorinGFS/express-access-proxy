'use strict';
// model is connector specific, custom model is extending base model and is dbName specific
const DB = require('../../db');

// Many methods in the MongoDB driver will return a promise if the caller doesn't pass a callback function.
class Model extends DB {
    constructor(connection) {
        super(connection);
        this.isConnected = false;
        this.collection = connection.namespace.split('.')[1];
    }
    async init() {
        if (!this.isConnected) {
            await this.connect()
                .then(() => (this.db = this.client.db(this.dbName)))
                .then(() => (this.isConnected = true));
        }
    }
    async close() {
        await this.client.close();
    }
    async command(command, options) {
        if (!this.isConnected) await this.init();
        return await this.db.command({ ...command }, { ...options });
    }
    async setOptions(collectionOptions, options) {
        if (!this.isConnected) await this.init();
        const command = { collMod: this.collection, ...collectionOptions };
        return await this.db.command({ ...command }, { ...options });
    }
    async indexes() {
        if (!this.isConnected) await this.init();
        return await this.db.command({ listIndexes: this.collection }).then((result) => result.cursor.firstBatch);
    }
    async createIndex(keys, options, commitQuorum) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).createIndex({ ...keys }, { ...options }, commitQuorum);
    }
    async dropIndex(index) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).dropIndex(index);
    }
    async validation() {
        if (!this.isConnected) await this.init();
        const collection = await this.db.listCollections({ name: this.collection }).toArray();
        return { validator: collection[0].options.validator, validationLevel: collection[0].options.validationLevel, validationAction: collection[0].options.validationAction };
    }
    async info() {
        if (!this.isConnected) await this.init();
        const collection = await this.db.listCollections({ name: this.collection }).toArray();
        return { info: collection[0].info };
    }
    async count(filter) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).countDocuments({ ...filter });
    }
    async find(filter, options) {
        if (!this.isConnected) await this.init();
        return await this.db
            .collection(this.collection)
            .find({ ...filter }, { ...options })
            .toArray();
    }
    async findByID(id) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).findOne({ _id: new this.ObjectId(id) });
    }
    async findOne(filter) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).findOne({ ...filter });
    }
    async insert(documents, options) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).insertMany([...documents], { ...options });
    }
    async insertByID(id, item) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).insertOne({ _id: new this.ObjectId(id), ...item });
    }
    async insertOne(item) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).insertOne({ ...item });
    }
    async update(filter, update) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).updateMany({ ...filter }, { $set: { ...update } });
    }
    async updateByID(id, update) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).updateOne({ _id: new this.ObjectId(id) }, { $set: { ...update } });
    }
    async updateOne(filter, update) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).updateOne({ ...filter }, { $set: { ...update } });
    }
    async upsert(filter, update) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).updateMany({ ...filter }, { $set: { ...update } }, { upsert: true });
    }
    async upsertByID(id, update) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).findOneAndUpdate({ _id: new this.ObjectId(id) }, { $set: { ...update } }, { upsert: true });
    }
    async upsertOne(filter, update) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).findOneAndUpdate({ ...filter }, { $set: { ...update } }, { upsert: true });
    }
    async delete(filter) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).deleteMany({ ...filter });
    }
    async deleteByID(id) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).deleteOne({ _id: new this.ObjectId(id) });
    }
    async deleteOne(filter) {
        if (!this.isConnected) await this.init();
        return await this.db.collection(this.collection).deleteOne({ ...filter });
    }
}

module.exports = Model;

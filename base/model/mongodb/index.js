'use strict';
// model is connector specific, custom model is extending base model and is dbName specific
const DB = require('../../db');

// Many methods in the MongoDB driver will return a promise if the caller doesn't pass a callback function.
class Model extends DB {
    constructor(connection) {
        super(connection);
        this.collection = connection.namespace.split('.')[1];
    }
    async close() {
        await this.client.close();
    }
    async command(command, options, callback) {
        return await this.db.command({ ...command }, { ...options }, callback);
    }
    async setOptions(collectionOptions, options, callback) {
        const command = { collMod: this.collection, ...collectionOptions };
        return await this.db.command({ ...command }, { ...options }, callback);
    }
    async indexes() {
        return await this.db.command({ listIndexes: this.collection }).then((result) => result.cursor.firstBatch);
    }
    async createIndex(keys, options, commitQuorum) {
        return await this.db.collection(this.collection).createIndex({ ...keys }, { ...options }, commitQuorum);
    }
    async dropIndex(index) {
        return await this.db.collection(this.collection).dropIndex(index);
    }
    async validation() {
        const collection = await this.db.listCollections({ name: this.collection }).toArray();
        return { validator: collection[0].options.validator, validationLevel: collection[0].options.validationLevel, validationAction: collection[0].options.validationAction };
    }
    async info() {
        const collection = await this.db.listCollections({ name: this.collection }).toArray();
        return { info: collection[0].info };
    }
    async count(filter, callback) {
        return await this.db.collection(this.collection).countDocuments({ ...filter }, callback);
    }
    async find(filter, options, callback) {
        return await this.db
            .collection(this.collection)
            .find({ ...filter }, { ...options }, callback)
            .toArray();
    }
    async findByID(id, callback) {
        return await this.db.collection(this.collection).findOne({ _id: new this.ObjectID(id) }, callback);
    }
    async findOne(filter, callback) {
        return await this.db.collection(this.collection).findOne({ ...filter }, callback);
    }
    async insert(documents, options, callback) {
        return await this.db.collection(this.collection).insertMany([...documents], { ...options }, callback);
    }
    async insertByID(id, item, callback) {
        return await this.db.collection(this.collection).insertOne({ _id: new this.ObjectID(id), ...item }, callback);
    }
    async insertOne(item, callback) {
        return await this.db.collection(this.collection).insertOne({ ...item }, callback);
    }
    async delete(filter, callback) {
        return await this.db.collection(this.collection).deleteMany({ ...filter }, callback);
    }
    async deleteByID(id, callback) {
        return await this.db.collection(this.collection).deleteOne({ _id: new this.ObjectID(id) }, callback);
    }
    async deleteOne(filter, callback) {
        return await this.db.collection(this.collection).deleteOne({ ...filter }, callback);
    }
    async update(filter, update, callback) {
        return await this.db.collection(this.collection).updateMany({ ...filter }, { $set: { ...update } }, callback);
    }
    async updateByID(id, update, callback) {
        return await this.db.collection(this.collection).updateOne({ _id: new this.ObjectID(id) }, { $set: { ...update } }, callback);
    }
    async updateOne(filter, update, callback) {
        return await this.db.collection(this.collection).updateOne({ ...filter }, { $set: { ...update } }, callback);
    }
    async upsert(filter, update, callback) {
        return await this.db.collection(this.collection).updateMany({ ...filter }, { $set: { ...update } }, { upsert: true }, callback);
    }
    async upsertByID(id, update, callback) {
        return await this.db.collection(this.collection).findOneAndUpdate({ _id: new this.ObjectID(id) }, { $set: { ...update } }, { upsert: true }, callback);
    }
    async upsertOne(filter, update, callback) {
        return await this.db.collection(this.collection).findOneAndUpdate({ ...filter }, { $set: { ...update } }, { upsert: true }, callback);
    }
}

module.exports = Model;

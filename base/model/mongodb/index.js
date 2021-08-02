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
    async command(command, options) {
        return await this.db.command({ ...command }, { ...options });
    }
    async setOptions(collectionOptions, options) {
        const command = { collMod: this.collection, ...collectionOptions };
        return await this.db.command({ ...command }, { ...options });
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
    async count(filter) {
        return await this.db.collection(this.collection).countDocuments({ ...filter });
    }
    async find(filter, options) {
        return await this.db
            .collection(this.collection)
            .find({ ...filter }, { ...options })
            .toArray();
    }
    async findByID(id) {
        return await this.db.collection(this.collection).findOne({ _id: new this.ObjectID(id) });
    }
    async findOne(filter) {
        return await this.db.collection(this.collection).findOne({ ...filter });
    }
    async insert(documents, options) {
        return await this.db.collection(this.collection).insertMany([...documents], { ...options });
    }
    async insertByID(id, item) {
        return await this.db.collection(this.collection).insertOne({ _id: new this.ObjectID(id), ...item });
    }
    async insertOne(item) {
        return await this.db.collection(this.collection).insertOne({ ...item });
    }
    async delete(filter) {
        return await this.db.collection(this.collection).deleteMany({ ...filter });
    }
    async deleteByID(id) {
        return await this.db.collection(this.collection).deleteOne({ _id: new this.ObjectID(id) });
    }
    async deleteOne(filter) {
        return await this.db.collection(this.collection).deleteOne({ ...filter });
    }
    async update(filter, update) {
        return await this.db.collection(this.collection).updateMany({ ...filter }, { $set: { ...update } });
    }
    async updateByID(id, update) {
        return await this.db.collection(this.collection).updateOne({ _id: new this.ObjectID(id) }, { $set: { ...update } });
    }
    async updateOne(filter, update) {
        return await this.db.collection(this.collection).updateOne({ ...filter }, { $set: { ...update } });
    }
    async upsert(filter, update) {
        return await this.db.collection(this.collection).updateMany({ ...filter }, { $set: { ...update } }, { upsert: true });
    }
    async upsertByID(id, update) {
        return await this.db.collection(this.collection).findOneAndUpdate({ _id: new this.ObjectID(id) }, { $set: { ...update } }, { upsert: true });
    }
    async upsertOne(filter, update) {
        return await this.db.collection(this.collection).findOneAndUpdate({ ...filter }, { $set: { ...update } }, { upsert: true });
    }
}

module.exports = Model;

'use strict';
// model is connector specific, custom model is extending base model and is dbName specific
const DB = require('../../db');

// Many methods in the MongoDB driver will return a promise if the caller doesn't pass a callback function.
class Model extends DB {
    constructor(connection) {
        super(connection);
    }
    async close() {
        await this.client.close();
    }
    async findByID(id, callback) {
        return await this.db.collection(this.connection.collection).findOne({ _id: new this.ObjectID(id) }, callback);
    }
    async findOne(filter, callback) {
        return await this.db.collection(this.connection.collection).findOne({ ...filter }, callback);
    }
    async findAll(callback) {
        return await this.db.collection(this.connection.collection).find({}).toArray(callback);
    }
    async countAll(callback) {
        return await this.db.collection(this.connection.collection).countDocuments({}, callback);
    }
    async count(filter, callback) {
        return await this.db.collection(this.connection.collection).countDocuments({ ...filter }, callback);
    }
    async insertByID(id, item, callback) {
        return await this.db.collection(this.connection.collection).insertOne({ _id: new this.ObjectID(id), ...item }, callback);
    }
    async insertOne(item, callback) {
        return await this.db.collection(this.connection.collection).insertOne({ ...item }, callback);
    }
    async delete(filter, callback) {
        return await this.db.collection(this.connection.collection).deleteMany({ ...filter }, callback);
    }
    async deleteByID(id, callback) {
        return await this.db.collection(this.connection.collection).deleteOne({ _id: new this.ObjectID(id) }, callback);
    }
    async deleteOne(filter, callback) {
        return await this.db.collection(this.connection.collection).deleteOne({ ...filter }, callback);
    }
    async update(filter, update, callback) {
        return await this.db.collection(this.connection.collection).updateMany({ ...filter }, { $set: { ...update } }, callback);
    }
    async updateByID(id, update, callback) {
        return await this.db.collection(this.connection.collection).updateOne({ _id: new this.ObjectID(id) }, { $set: { ...update } }, callback);
    }
    async updateOne(filter, update, callback) {
        return await this.db.collection(this.connection.collection).updateOne({ ...filter }, { $set: { ...update } }, callback);
    }
    async upsert(filter, update, callback) {
        return await this.db.collection(this.connection.collection).updateMany({ ...filter }, { $set: { ...update } }, { upsert: true }, callback);
    }
    async upsertByID(id, update, callback) {
        return await this.db.collection(this.connection.collection).findOneAndUpdate({ _id: new this.ObjectID(id) }, { $set: { ...update } }, { upsert: true }, callback);
    }
    async upsertOne(filter, update, callback) {
        return await this.db.collection(this.connection.collection).findOneAndUpdate({ ...filter }, { $set: { ...update } }, { upsert: true }, callback);
    }
}

module.exports = Model;

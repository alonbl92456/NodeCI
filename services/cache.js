const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');
const redisUrl = keys.redisUrl || 'redis://localhost:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;


mongoose.Query.prototype.cache = function () {
    this.useCache = true;

    return this;
}


mongoose.Query.prototype.exec = async function () {

    if (!this.useCache) {
        return exec.apply(this, arguments);
    }
    else {
        // Gets all keys properites to one object 
        const key = JSON.stringify(Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        }));

        const cachedVal = await client.get(key);

        if (cachedVal) {
            let parsedCachedVal = JSON.parse(cachedVal);
            let model = this.model;
            return parsedCachedVal.map ?
                parsedCachedVal.map(cur => new model(cur)) : new this.model(parsedCachedVal);
        }




        let res = await exec.apply(this, arguments);

        client.set(key, JSON.stringify(res), 'EX',10);

        return Promise.resolve(res);
    }
}
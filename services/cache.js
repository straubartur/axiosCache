const mongoose = require('mongoose')
const redis = require('redis');
const util = require('util');
const redisUrl = process.env.REDIS_URI
const client = redis.createClient(redisUrl)
client.auth(process.env.REDIS_AUTH, function (err) {
    if (err) {
        console.log('error', err)
    }
});

client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;


mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');


  return this;
}

mongoose.Query.prototype.exec = async function () {
  if (this.useCache) {
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    }))
  
    const cacheValue = await client.hget(this.hashKey, key);
    if (cacheValue) {
      const doc = JSON.parse(cacheValue)
      return Array.isArray(doc) 
        ? doc.map(d => new this.model(d))
        : new this.model(doc)
    }
  
    const result = await exec.apply(this, arguments);
  
    try {
      client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 300);
      return result;
    } catch (error) {
      return result;
    }
  }
  return exec.apply(this, arguments);
}

module.exports = {
  clearHash() {
    client.flushall();
  }
}
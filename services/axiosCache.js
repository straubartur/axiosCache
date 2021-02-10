const axios = require('axios');
const redis = require('redis')
const util = require('util');
const redisUrl = process.env.REDIS_URI
const client = redis.createClient(redisUrl)
client.auth(process.env.REDIS_AUTH, function (err) {
    if (err) {
        console.log('error', err)
    }
});

client.get = util.promisify(client.get);

async function get(params) {
    try {
        const key = JSON.stringify(params)
        const cacheValue = await client.get(key);
        if(cacheValue) {
            return JSON.parse(cacheValue)
        }

        const response = await axios(params);
        client.set(key, JSON.stringify(response.data), 'EX', 300)
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error()
    }
}

module.exports = get
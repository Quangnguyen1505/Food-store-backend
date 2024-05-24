// const { RedisClient } = require('redis');
const { NotFoundError, BadRequestError } = require('../core/error.response');
// const { getRedis } = require('../db/init.redis');
// const { promisify } = require('util');
// const { 
//     instanceConnect: redisClient
// } = getRedis();
// const hgetAsync = promisify(redisClient.hgetall).bind(redisClient);
// const hincrbyAsync = promisify(redisClient.hSet).bind(redisClient);

const redis = require('../db/init.redis');

const HEADER = {
    CLIENT_ID: 'x-client-id'
}

const rateLimiter = async ( req, res, next ) => {
    
    const clientId = req.headers[HEADER.CLIENT_ID];
    if(!clientId) return res.json({
        result: "error",
        message: "Client Id not exitst!!"
    });

    const currentTime = Date.now();
    
    const client = await redis.hGetAll(`rateLimiter-${clientId}`);
    if( !client || Object.keys(client).length === 0 ){
        await redis.hSet(`rateLimiter-${clientId}`, 'createdAt', currentTime );
        await redis.hSet(`rateLimiter-${clientId}`, 'count', 1 );

        return next();
    }

    const difference = ( currentTime - client.createdAt ) / 1000;
    if(difference >= 60){
        await redis.hSet(`rateLimiter-${clientId}`, 'createdAt', currentTime );
        await redis.hSet(`rateLimiter-${clientId}`, 'count', 1 );

        return next();
    }

    console.log("client.count",client.count);
    if(client.count >= +5) return res.json({
        result: "error",
        message: "not spam!!"
    });
    await redis.hIncrBy(`rateLimiter-${clientId}`, 'count', 1);
    return next();
}

module.exports = rateLimiter;
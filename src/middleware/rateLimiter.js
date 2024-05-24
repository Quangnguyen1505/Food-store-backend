const { RedisClient } = require('redis');
const { NotFoundError, BadRequestError } = require('../core/error.response');
const { getRedis } = require('../db/init.redis');
const { promisify } = require('util');
const { 
    instanceConnect: redisClient
} = getRedis();
const hgetAsync = promisify(redisClient.hgetall).bind(redisClient);
const hincrbyAsync = promisify(redisClient.hincrby).bind(redisClient);

const HEADER = {
    CLIENT_ID: 'x-client-id'
}

const rateLimiter = async ( req, res, next ) => {
    
    const clientId = req.headers[HEADER.CLIENT_ID];
    if(!clientId) throw new NotFoundError("Client Id not exitst!!");

    const currentTime = Date.now();
    
    const client = await hgetAsync(`rateLimiter-${clientId}`);
    if( !client || Object.keys(client).length === 0 ){
        await RedisClient.hmset(`rateLimiter-${clientId}`, 'createdAt', currentTime, 'count', 1);

        return next();
    }

    const difference = ( currentTime - client.createdAt ) / 1000;
    if(difference >= 60){
        await RedisClient.hmset(`rateLimiter-${clientId}`, 'createdAt', currentTime, 'count', 1);

        return next();
    }

    console.log("client.count",client.count);
    if(client.count > +5) throw new BadRequestError('not spam!!');
    await hincrbyAsync(`rateLimiter-${clientId}`, 'count', 1); 
    return next();
}

module.exports = rateLimiter;
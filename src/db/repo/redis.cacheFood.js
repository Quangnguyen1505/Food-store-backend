const redis = require('../init.redis');

const getFoodRedis = async({ limit, page }) => {
    const cachedFoods = await redis.get(`foods-item-${limit}-${page}`);
    return cachedFoods;
}

const cacheCount = async() => {
    const cachedTotalCount = await redis.get('foods-totalCount');
    return cachedTotalCount;
}

const setItemFoods = async({ limit, page, foods }) => {
    return await redis.set(`foods-item-${limit}-${page}`, JSON.stringify(foods), 'EX', 3600);
}

const setTotalCount = async(totalCount) => {
    return await redis.set('foods-totalCount', totalCount.toString(), 'EX', 3600);
}

const foundRedis = async (key) => {
    return await redis.get(key); 
}

const setRedis = async (key, body) => {
    return await redis.set(key, JSON.stringify(body), 'EX', 3600);
}

module.exports = {
    getFoodRedis,
    cacheCount,
    setItemFoods,
    setTotalCount,
    foundRedis,
    setRedis
}
const { NotFoundError, BadRequestError } = require('../core/error.response');
const food = require('../models/food.model');
const tagModel = require('../models/tag.model');
const { createNotification } = require('./notification.service');
const { getFoodRedis, cacheCount, setItemFoods, setTotalCount, setRedis, foundRedis } = require('../db/repo/redis.cacheFood');
const { findUserById } = require('../models/repo/access.repo');
const { findFoodById } = require('../models/repo/cart.repo');

class FoodServices{

    static insertFood = async ({
        payload
    }) =>{
        const { name, price, tags, favorite = false, stars = 5.0, imageUrl, origins, cookTime  } = payload
        const foundFood = await food.findOne({name});
        if(foundFood) throw new NotFoundError("food is not exitst");

        const newFood = await food.create({
            name,
            price,
            tags,
            favorite,
            stars,
            imageUrl,
            origins,
            cookTime
        })

        if(!newFood) throw new BadRequestError("food create failed!!");

        //tag
        const foundTag = await tagModel.findOne({name: tags});
        if(!foundTag) throw new NotFoundError("tag is not exitst");
        const foundTagAll = await tagModel.findOne({name: "All"});
        foundTag.count += 1;
        foundTagAll.count += 1;
        await foundTag.save();
        await foundTagAll.save();

        //noti
        await createNotification({
            noti_type: "SHOP-001",
            noti_options: {
                foodId: newFood._id,
                foodName: newFood.name
            }
        });

        return newFood
    }

    static updateFavorite = async ({ 
        userId, foodId 
    }) => {
        const foundUser = await findUserById(userId);
        if(!foundUser) throw new BadRequestError('User not exitst!!');

        const foundFood = await findFoodById(foodId);
        if(!foundFood) throw new BadRequestError('Food not exitst!!');

        foundFood.favorite = !foundFood.favorite;
        await foundFood.save();

        return foundFood;
    } 

    static getFood = async ({ limit = 8, page = 1 }) => {
        let totalCount, foods;
    
        // const cachedFoods = await getFoodRedis({limit, page});
        // const cachedTotalCount = await cacheCount();
    
        // if (cachedFoods && cachedTotalCount) {
        //     foods = JSON.parse(cachedFoods);
        //     totalCount = parseInt(cachedTotalCount, 10);
        //     return { 
        //         foods,
        //         totalCount
        //     };
        // }
    
        const select = ['-__v', '-createdAt', '-updatedAt'];
        totalCount = await food.countDocuments();
        foods = await food.find().limit(limit).skip((page - 1) * limit).select(select);
    
        // await setItemFoods({limit, page, foods});
        // await setTotalCount(totalCount);

        return { 
            foods,
            totalCount
        };
    }
    

    static getFoodById = async (FoodId)=>{
       
        const foods = await food.findById(FoodId);
        if(!foods) throw new NotFoundError("food is not exists")
        return foods
    }

    static getAllFoodsBySearchTerm = async ({
        searchTerm
    }) => {
        let foods;
        
        const key = `food-search`
        const getRedisSearch = await foundRedis(key);
        if( getRedisSearch ){
            foods = JSON.parse(getRedisSearch);
            return foods;
        }

        const searchRegex = new RegExp(searchTerm, 'i');
        foods = await food.find({ name: { $regex: searchRegex } });

        await setRedis(key, foods);

        return foods;
    }

    static createTag = async ({
        name
    }) => {
        const foundTag = await tagModel.findOne({name});
        if(foundTag) throw new NotFoundError("tag is exitst");
        
        const foundFoods = await food.find({tags: name});
        if(!foundFoods) throw new NotFoundError("food is not exitst");

        const newTag = await tagModel.create({
            name,
            count: foundFoods.length
        });

        return newTag;
    }

    static getTags = async ()=>{
       
        const foundTag = await tagModel.find();
        
        return foundTag;
    }

    static getAllFoodsByTag = async (tag)=>{
        let foundFood, totalCount;
        const key1 = `item-food-${tag}`, key2 = `total-count-food-${tag}`;
        const foundFoodByTagFromRedis = await foundRedis(key1);
        const foundTotalCountFromRedis = await foundRedis(key2);
        if( foundFoodByTagFromRedis && foundTotalCountFromRedis ){
            foundFood = JSON.parse(foundFoodByTagFromRedis);
            totalCount = parseInt(foundTotalCountFromRedis, 10);
            return {
                foundFood,
                totalCount
            }
        }

        foundFood = await food.find({tags: tag});
        if(!foundFood) throw new BadRequestError("tag is exists");
        totalCount = await food.countDocuments();

        await setRedis(key1, foundFood);
        await setRedis(key2, totalCount);

        return {
            foundFood,
            totalCount
        }
    }

    static updateFood = async ( foodId, payload ) => {
        const newFood = await food.findByIdAndUpdate(foodId, payload, {
            new: true
        });
        return newFood
    }
}


module.exports = FoodServices
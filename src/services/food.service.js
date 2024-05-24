const { NotFoundError, BadRequestError } = require('../core/error.response');
const food = require('../models/food.model');
const tagModel = require('../models/tag.model');
const { createNotification } = require('./notification.service');

const { getRedis } = require('../db/init.redis');
const { promisify } = require('util');
const {
    instanceConnect: redisClient
} = getRedis();
const getAsync = promisify(redisClient.get).bind(redisClient);

class FoodServices{

    static insertFood = async ({
        payload
    }) =>{
        const { name, price, tags, favorite, stars, imageUrl, origins, cookTime  } = payload
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

    static getFood = async ({ limit = 8, page = 1 }) => {
        let totalCount, foods;
    
        const cachedFoods = await getAsync(`foods-item-${limit}-${page}`);
        const cachedTotalCount = await getAsync('foods-totalCount');
    
        if (cachedFoods && cachedTotalCount) {
            foods = JSON.parse(cachedFoods);
            totalCount = parseInt(cachedTotalCount, 10);
            return { 
                foods,
                totalCount
            };
        }
    
        const select = ['-__v', '-createdAt', '-updatedAt'];
        totalCount = await food.countDocuments();
        foods = await food.find().limit(limit).skip((page - 1) * limit).select(select);
    
        // Lưu dữ liệu vào Redis
        await redisClient.set(`foods-item-${limit}-${page}`, JSON.stringify(foods), 'EX', 3600);
        await redisClient.set('foods-totalCount', totalCount.toString(), 'EX', 3600);
    
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
        const searchRegex = new RegExp(searchTerm, 'i');
        const foods = await food.find({ name: { $regex: searchRegex } });
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
        })

        return newTag
    }

    static getTags = async ()=>{
       
        const foundTag = await tagModel.find()
        
        return foundTag
    }

    static getAllFoodsByTag = async (tag)=>{
        const foundFood = await food.find({tags: tag});
        if(!foundFood) throw new BadRequestError("tag is exists");
        const totalCount = await food.countDocuments();

        return {
            foundFood,
            totalCount
        }
    }
}


module.exports = FoodServices
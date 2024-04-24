const { NotFoundError, BadRequestError } = require('../core/error.response');
const food = require('../models/food.model');
const tagModel = require('../models/tag.model');

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

        const foundTag = await tagModel.findOne({name: tags});
        if(!foundTag) throw new NotFoundError("tag is not exitst");
        const foundTagAll = await tagModel.findOne({name: "All"});
        foundTag.count += 1;
        foundTagAll.count += 1;
        await foundTag.save();
        await foundTagAll.save();

        return newFood
    }

    static getFood = async ({ limit = 8, page = 1 })=>{
        const select = ['-__v', '-createdAt', '-updatedAt'];
        const totalCount = await food.countDocuments();
        const foods = await food.find().limit(limit).skip((page - 1) * limit).select(select);
        
        return { 
            foods,
            totalCount
        }
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
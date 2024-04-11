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

        return newFood
    }

    static getFood = async ()=>{
        const foods = await food.find()
        
        return foods
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
        name, count
    }) =>{
        const foundFood = await tagModel.findOne({name});
        if(foundFood) throw new NotFoundError("tag is exitst");

        const newTag = await tagModel.create({
            name,
            count
        })

        return newTag
    }

    static getTags = async ()=>{
       
        const foundTag = await tagModel.find()
        
        return foundTag
    }

    static getAllFoodsByTag = async (tag)=>{
        const foundFood = await food.find({tags: tag});
        if(!foundFood) throw new BadRequestError("tag is exists")
        return foundFood
    }
}


module.exports = FoodServices
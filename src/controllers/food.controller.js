const { SuccessResponse } = require("../core/success.response");
const FoodServices = require("../services/food.service");

class FoodController{
    createFood = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create food success",
            metadata: await FoodServices.insertFood(req.body)
        }).send(res);
    }

    updateFavorite = async ( req, res, next ) => {
        new SuccessResponse({
            message: "update Favorite food success",
            metadata: await FoodServices.updateFavorite({userId: req.userId, foodId: req.params.id})
        }).send(res);
    }
    
    getFood = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get food success",
            metadata: await FoodServices.getFood(req.query)
        }).send(res);
    }

    getFoodById = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get food success",
            metadata: await FoodServices.getFoodById(req.params.id)
        }).send(res);
    }

    getAllFoodsBySearchTerm = async ( req, res, next ) => {
        new SuccessResponse({
            message: "getAllFoodsBySearchTerm success",
            metadata: await FoodServices.getAllFoodsBySearchTerm({
                searchTerm: req.params.searchTerm
            })
        }).send(res);
    }

    createTag = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create tag food success",
            metadata: await FoodServices.createTag(req.body)
        }).send(res);
    }

    getTags = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get tag success",
            metadata: await FoodServices.getTags(req.query)
        }).send(res);
    }

    getAllFoodsByTag = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get all food by tag success",
            metadata: await FoodServices.getAllFoodsByTag(req.params.tag)
        }).send(res);
    } 

    getAllFoodsByTagV2 = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get all food by tag V2 success",
            metadata: await FoodServices.getAllFoodByTagV2(req.params.tag)
        }).send(res);
    } 

    updateFood = async ( req, res, next ) => {
        new SuccessResponse({
            message: "update food success",
            metadata: await FoodServices.updateFood( req.params.foodId, req.body )
        }).send(res);
    }

    deleteFood = async ( req, res, next ) => {
        new SuccessResponse({
            message: "delete food success",
            metadata: await FoodServices.deleteFood( req.params.foodId )
        }).send(res);
    }
}


module.exports = new FoodController();
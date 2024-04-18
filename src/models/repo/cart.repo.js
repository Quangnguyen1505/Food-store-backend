const foodModel = require("../food.model");

const findFoodById = async (foodId) => {
    return await foodModel.findById(foodId);
}

module.exports = {
    findFoodById
}
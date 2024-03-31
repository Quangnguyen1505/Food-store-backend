const express = require('express');
const FoodService = require('../../controllers/food.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');

router.post("", handlerError(FoodService.createFood));
router.get("", handlerError(FoodService.getFood));
router.get("/findone/:id", handlerError(FoodService.getFoodById));
router.get("/allSearch/:searchTerm", handlerError(FoodService.getAllFoodsBySearchTerm));
router.post("/tag", handlerError(FoodService.createTag));
router.get("/tag", handlerError(FoodService.getTags));
router.get("/AllFoodBytag/:tag", handlerError(FoodService.getAllFoodsByTag));
module.exports = router
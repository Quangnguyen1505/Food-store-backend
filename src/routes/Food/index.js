const express = require('express');
const FoodService = require('../../controllers/food.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const rateLimiter = require('../../middleware/rateLimiter');
const { authencationV2 } = require('../../auth/authUtils');

router.get("", handlerError(FoodService.getFood));
router.get("/findone/:id", handlerError(FoodService.getFoodById));
router.get("/allSearch/:searchTerm", handlerError(FoodService.getAllFoodsBySearchTerm));
router.post("/tag", handlerError(FoodService.createTag));
router.get("/tag", handlerError(FoodService.getTags));
router.get("/AllFoodBytag/:tag", handlerError(FoodService.getAllFoodsByTag));

router.use(authencationV2);
router.use(rateLimiter);

router.post("", handlerError(FoodService.createFood));
router.get("/favorite/:id", handlerError(FoodService.updateFavorite));
router.post("/update/:foodId", handlerError(FoodService.updateFood));
router.get("/delete/:foodId", handlerError(FoodService.deleteFood));

module.exports = router
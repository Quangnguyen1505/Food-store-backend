const express = require('express');
const FoodService = require('../../controllers/food.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const rateLimiter = require('../../middleware/rateLimiter');
const { authencationV2 } = require('../../auth/authUtils');

router.post("", handlerError(FoodService.createFood));
// router.use(rateLimiter);
router.get("", handlerError(FoodService.getFood));
router.get("/findone/:id", handlerError(FoodService.getFoodById));
router.get("/allSearch/:searchTerm", handlerError(FoodService.getAllFoodsBySearchTerm));
router.post("/tag", handlerError(FoodService.createTag));
router.get("/tag", handlerError(FoodService.getTags));
router.get("/AllFoodBytag/:tag", handlerError(FoodService.getAllFoodsByTag));

router.use(authencationV2);
router.get("/favorite/:id", handlerError(FoodService.updateFavorite));

module.exports = router
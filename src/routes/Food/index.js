const express = require('express');
const foodController = require('../../controllers/food.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const rateLimiter = require('../../middleware/rateLimiter');
const { authencationV2 } = require('../../auth/authUtils');
const { grantAccess } = require('../../middleware/rbac');

router.get("", handlerError(foodController.getFood));
router.get("/findone/:id", handlerError(foodController.getFoodById));
router.get("/allSearch/:searchTerm", handlerError(foodController.getAllFoodsBySearchTerm));
router.post("/tag", handlerError(foodController.createTag));
router.get("/tag", handlerError(foodController.getTags));
router.get("/AllFoodBytag/:tag", handlerError(foodController.getAllFoodsByTag));
router.get("/AllFoodBytagV2/:tag", grantAccess('readAny','profile'), handlerError(foodController.getAllFoodsByTagV2));

router.use(authencationV2);
router.use(rateLimiter);

router.post("", handlerError(foodController.createFood));
router.get("/favorite/:id", handlerError(foodController.updateFavorite));
router.post("/update/:foodId", handlerError(foodController.updateFood));
router.get("/delete/:foodId", handlerError(foodController.deleteFood));

module.exports = router
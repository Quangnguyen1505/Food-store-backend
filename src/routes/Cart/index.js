const express = require('express');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const rateLimiter = require('../../middleware/rateLimiter');

router.use(authencationV2);
router.use(rateLimiter);

router.post("/addToCart", handlerError(cartController.addToCart));
router.post("/updateQuantity", handlerError(cartController.updateQuantityFood));
router.get("", handlerError(cartController.getListFoodCar));
router.get("/delete/:foodId", handlerError(cartController.deleteItem));

module.exports = router
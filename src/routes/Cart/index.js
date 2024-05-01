const express = require('express');
const cartController = require('../../controllers/cart.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.use(authencationV2);
router.post("/addToCart", handlerError(cartController.addToCart));
router.post("/updateQuantity", handlerError(cartController.updateQuantityFood));
router.get("", handlerError(cartController.getListFoodCar));
router.get("/delete/:foodId", handlerError(cartController.deleteItem));

module.exports = router
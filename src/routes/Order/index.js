const express = require('express');
const CheckoutController = require('../../controllers/checkout.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');
const rateLimiter = require('../../middleware/rateLimiter');

router.use(authencationV2);
router.use(rateLimiter);

router.post("", handlerError(CheckoutController.getCheckoutReview));
router.post("/create", handlerError(CheckoutController.orderByUser));
router.get("/listOrder", handlerError(CheckoutController.getListOrder));

module.exports = router
const express = require('express');
const CheckoutController = require('../../controllers/checkout.controller');
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.use(authencationV2);
router.post("", handlerError(CheckoutController.getCheckoutReview));
module.exports = router
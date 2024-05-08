const express = require('express');
const DiscountController = require('../../controllers/discount.controller')
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');

router.post("/create", handlerError(DiscountController.createDiscount));
router.get("/amout", handlerError(DiscountController.getDiscountAmout));
router.get("", handlerError(DiscountController.getAllDiscount));
router.get("/:discount_id", handlerError(DiscountController.getDiscountById));

module.exports = router
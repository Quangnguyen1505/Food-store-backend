const express = require('express');
const DiscountController = require('../../controllers/discount.controller')
const router = express.Router();
const handlerError = require('../../helper/asyncHandler');
const { authencationV2 } = require('../../auth/authUtils');

router.use(authencationV2);
router.post("/create", handlerError(DiscountController.createDiscount));
router.get("/amout", handlerError(DiscountController.getDiscountAmout));
router.post("/update", handlerError(DiscountController.updateDiscount));
router.get("", handlerError(DiscountController.getAllDiscount));
router.get("/:discount_id", handlerError(DiscountController.getDiscountById));
router.get("/delete/:discount_id", handlerError(DiscountController.deleteDiscountById));

module.exports = router
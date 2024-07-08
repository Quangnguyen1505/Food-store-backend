const { SuccessResponse } = require("../core/success.response");
const DiscountServices = require("../services/discount.service");

class DiscountController{

    createDiscount = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Create discount success",
            metadata: await DiscountServices.createDiscount(req.body)
        }).send(res);
    }

    updateDiscount = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Update discount success",
            metadata: await DiscountServices.updateDiscount(req.body)
        }).send(res);
    }

    getDiscountAmout = async ( req, res, next ) => {
        new SuccessResponse({
            message: "Create discount success",
            metadata: await DiscountServices.getDiscountAmout(req.body)
        }).send(res);
    }

    getAllDiscount = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get all discount success",
            metadata: await DiscountServices.getAllDiscounts(req.query)
        }).send(res);
    }

    getDiscountById = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get all discount success",
            metadata: await DiscountServices.getDiscountById(req.params.discount_id)
        }).send(res);
    }

    deleteDiscountById = async ( req, res, next ) => {
        new SuccessResponse({
            message: "delete discount success",
            metadata: await DiscountServices.deleteDiscount(req.params.discount_id)
        }).send(res);
    }
}


module.exports = new DiscountController();
const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController{

    getCheckoutReview = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get Checkout Review success",
            metadata: await CheckoutService.getListCheckout(req.body)
        }).send(res);
    }

    orderByUser = async ( req, res, next ) => {
        new SuccessResponse({
            message: "order By User success",
            metadata: await CheckoutService.orderByUser(req.body)
        }).send(res);
    }

    getListOrder = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get List Order success",
            metadata: await CheckoutService.getListOrder({userId: req.userId, ...req.query})
        }).send(res);
    }

}


module.exports = new CheckoutController();
const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController{

    getCheckoutReview = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get Checkout Review success",
            metadata: await CheckoutService.getListCheckout(req.body)
        }).send(res);
    }

}


module.exports = new CheckoutController();
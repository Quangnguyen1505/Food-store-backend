const { SuccessResponse } = require("../core/success.response");
const cartServices = require("../services/cart.service");

class CartController{
    addToCart = async ( req, res, next ) => {
        new SuccessResponse({
            message: "create cart user success",
            metadata: await cartServices.addToCart(req.body)
        }).send(res);
    }

    updateQuantityFood = async ( req, res, next ) => {
        new SuccessResponse({
            message: "update Quantity Food success",
            metadata: await cartServices.updateCart(req.body)
        }).send(res);
    }

    getListFoodCar = async ( req, res, next ) => {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId in query parameters' });
        }
        new SuccessResponse({
            message: "get Car Food success",
            metadata: await cartServices.getCartByUserId(userId)
        }).send(res);
    }

    deleteItem = async ( req, res, next ) => {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId in query parameters' });
        }
        new SuccessResponse({
            message: "get Car Food success",
            metadata: await cartServices.deleteFoodCart({userId, foodId: req.params.foodId})
        }).send(res);
    }
}


module.exports = new CartController();
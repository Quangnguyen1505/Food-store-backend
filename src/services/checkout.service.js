const { NotFoundError, BadRequestError } = require("../core/error.response");
const cartModel = require("../models/cart.model");

class CheckoutService {
    static async getListCheckout({ userId, cartId, foods_order = [] }) {
        const foundCart = await cartModel.findById(cartId);
        if(!foundCart) throw new NotFoundError("Cart not found");

        if(!foundCart.cart_foods.length) throw new BadRequestError("cart foods not exitst!!");

        let orderCheckout = {
            items_food: foundCart.cart_foods,
            total_price: 0
        }
        for (let index = 0; index < foods_order.length; index++) {
            if(foundCart.cart_foods[index].foodId === foods_order[index].foodId){
                const checkoutPrice = foundCart.cart_foods.reduce((acc, product)=>{
                    return acc + (product.price * product.quantity);
                },0);
                orderCheckout.total_price = checkoutPrice;
            }else{
                throw new BadRequestError("Food not found in cart");
            }
        }
        return orderCheckout;
    }
}

module.exports = CheckoutService;
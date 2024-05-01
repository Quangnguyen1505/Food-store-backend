const { NotFoundError, BadRequestError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const orderModel = require("../models/order.model");
const { deleteCart } = require("../models/repo/order.repo");
const { convertToObject } = require("../utils");

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

    static async orderByUser({ userId, cartId, user_address, foods_order = [] }) {
 
        const foundCart = await cartModel.findById(cartId);
        if(!foundCart) throw new NotFoundError("Cart not found");

        if(!foundCart.cart_foods.length) throw new BadRequestError("cart foods not exitst!!");

        const orderCheckout = await CheckoutService.getListCheckout({ userId, cartId, foods_order });

        const newOrder = await orderModel.create({
            order_userId: convertToObject(userId),
            order_checkout: orderCheckout.total_price,
            order_products: foods_order,
            order_shipping: user_address
        });

        if(!newOrder) throw new BadRequestError("Order not created");

        await deleteCart( cartId ); 

        return newOrder;
    }

    static async getListOrder({ userId, limit = 4, page = 1 }){
        const select = ['-__v', '-createdAt', '-updatedAt'];
        const orders = await orderModel.find({order_userId: convertToObject(userId)}).populate('order_userId', 'name address')
        .limit(limit).skip((page - 1) * limit).select(select);
        const totalCountOrder = await orderModel.countDocuments({order_userId: convertToObject(userId)});
        if(!orders) throw new NotFoundError("Order not found");
        return { 
            orders,
            totalCountOrder
        }
    } 
}

module.exports = CheckoutService;
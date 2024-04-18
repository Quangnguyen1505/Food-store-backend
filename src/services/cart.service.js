const { NotFoundError } = require('../core/error.response');
const cartModel = require('../models/cart.model');
const { findFoodById } = require('../models/repo/cart.repo');
const { convertToObject } = require('../utils');

class CartServices {
    static async createUserCart({ userId, food }){
        const query = { cart_userId: convertToObject(userId), cart_state: 'active' },
        updateOrInsert = {
            $addToSet: { 
                cart_foods: food
            }
        }, options = { upsert: true, new: true };

        return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async updateUserCartQuantity({ userId, food }){
        const { foodId, quantity } = food;
        const query = { cart_userId: convertToObject(userId), 'cart_foods.foodId': foodId, cart_state: 'active'},
        updateSet = {
            $inc: {
                'cart_foods.$.quantity': quantity
            }
        }, options = { new: true, upsert: true };

        return await cartModel.findOneAndUpdate(query, updateSet, options);
    }

    static async addToCart({ userId, food = {} }){
        const foundCart = await cartModel.findOne({ cart_userId: convertToObject(userId) });

        if(!foundCart){
            return await CartServices.createUserCart({ userId, food });
        }

         // neu co gio hang ma chua co san pham
         if(foundCart.cart_foods.length === 0){
            foundCart.cart_foods = [food];
            return await foundCart.save();
         }
         // neu gio hang ton tai  va co san pham nay thi update quantity (cong quantity

         for (let index = 0; index < foundCart.cart_foods.length; index++) {
            if(foundCart.cart_foods[index].foodId == food.foodId){
                return await CartServices.updateUserCartQuantity({ userId, food });
            }
         }

         return await CartServices.createUserCart({ userId, food }); 
    }
    
    static async deleteFoodCart({ userId, foodId }){
        const query = { cart_userId: convertToObject(userId), 'cart_foods.foodId': foodId, cart_state: 'active' },
        updateSet = {
            $pull: {
                cart_foods: { foodId }
            }
        }, options = { new: true, upsert: true };

        return await cartModel.findOneAndUpdate(query, updateSet, options);
    }

    static async updateCartQuantity({ userId, food }){
        const { foodId, quantity } = food;
        const query = { cart_userId: convertToObject(userId), 'cart_foods.foodId': foodId, cart_state: 'active' },
        updateSet = {
            $inc: {
                'cart_foods.$.quantity': quantity
            }
        }, options = { new: true, upsert: true };

        return await cartModel.findOneAndUpdate(query, updateSet, options);
    }
    
    /*
     user_order_ids: [
        {
            item_foods: [
                {
                    quantity,
                    price,
                    old_quantity,
                    foodId
                }
            ]
        }
     ]
     */
    static async updateCart({ userId, user_order_ids }){
        const { foodId, quantity, old_quantity } = user_order_ids[0].item_foods[0];

        const foundCart = await cartModel.findOne({cart_userId: convertToObject(userId), cart_state: 'active'});

        if(!foundCart){
            throw new NotFoundError('Cart not found');
        }

        const foundFood = await findFoodById(foodId);
        if(!foundFood){
            throw new NotFoundError('Food not found');
        }

        if(quantity == 0){
            //delete
            return await CartServices.deleteFoodCart({ userId, foodId });
        }

        //updateCartQuantity
        return await CartServices.updateCartQuantity({
            userId, 
            food: {
                foodId,
                quantity: quantity - old_quantity
            }
        });
    }

    static async getCartByUserId( userId ){
        return await cartModel.findOne({ cart_userId: convertToObject(userId) });
    }
}

module.exports = CartServices;
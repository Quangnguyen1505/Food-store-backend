const cartModel = require("../cart.model")

const deleteCart = async ( cartId ) => {
    return await cartModel.findByIdAndDelete(cartId)
}

module.exports = {
    deleteCart
}
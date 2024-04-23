const { model ,Schema, Types } = require('mongoose');

const DOCUMENT_NAME = "order";
const COLECTION_NAME = "orders";

const orderSchema = new Schema({
    order_userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    order_checkout: { type: Object, default: {}},
    /*
        order_checkout = {
            total_Price,
            totalapplyDiscount,
            feeShip
        } 
    */
   order_shipping: { type: Object, default: {}},// thong tin don hang
   /*
   street,
   city,
   state,
   country
    */
   order_products: { type: Array, required: true}, // shop_order_ids_new. nhung san pham mua
   
},{
    collection: COLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, orderSchema)
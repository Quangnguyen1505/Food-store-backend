const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = "cart";
const COLLECTION_NAME = "carts";

const cartSchema = new Schema({
    cart_state: {
        type: String,
        require: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_foods: {
        type: Array,
        require: true,
        default: []
    },
    cart_count_product: {
        type: Number,
        default: 0
    },
    cart_userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
});

module.exports = model(DOCUMENT_NAME, cartSchema);
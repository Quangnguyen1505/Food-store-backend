const { model, Schema } = require('mongoose'); 

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';
var discountSchema = new Schema({
    discount_code:{
        type: String,
        required:true,
    },
    discount_name:{
        type:String,
        require: true
    },
    discount_value:{
        type:Number,
        require: true
    },
    discount_start_date:{
        type: Date,
        required: true
    },
    discount_end_date:{
        type: Date,
        required: true
    },
    discount_count: {
        type: Number,
        default: 0
    },
    discount_food_ids: {
        type: Array,
        default: []
    },
    discount_userId: {
        type: Schema.Types.ObjectId,
        default: null
    }
},{
    collection:COLLECTION_NAME,
    timestamps:true
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
const { model ,Schema, Types } = require('mongoose');

const DOCUMENT_NAME = "food";
const COLECTION_NAME = "foods";

const foodSchema = new Schema({
    name: String,
    price: Number,
    tags: [String],
    favorite: Boolean,
    stars: Number,
    imageUrl: String,
    origins: [String],
    cookTime: String,
},{
    collection: COLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, foodSchema)
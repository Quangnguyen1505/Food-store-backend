const { model ,Schema, Types } = require('mongoose');

const DOCUMENT_NAME = "tag";
const COLECTION_NAME = "tags";

const tagSchema = new Schema({
    name: String,
    count: Number,
},{
    collection: COLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, tagSchema)
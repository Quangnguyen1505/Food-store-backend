const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "notifications";

//ORDER-001: ORDER SUCCESFULLY
//ORDER-002: ORDER FAILED
//PROMOTION-001: NEW PROMOTION(ma giam gia)
//SHOP-001: NEW FOOD BY SHOP

const notificationSchema = new Schema({
    noti_type: { type: String, enum: [ 'ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001' ]},
    noti_content: { type: String, require: true },
    noti_options: { type: Object, default: {} }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = {
    NOTI: model(DOCUMENT_NAME, notificationSchema)
}
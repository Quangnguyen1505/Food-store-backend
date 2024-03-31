const { model, Schema } = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';
var keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'Shop'
    },
    privateKey:{
        type:String,
        require: true
    },
    publicKey:{
        type:String,
        require: true
    },
    refreshTokensUsed:{
        type: Array,
        default: []
    },
    refreshToken:{
        type:String,
        require: true
    },
},{
    collection:COLLECTION_NAME,
    timestamps:true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
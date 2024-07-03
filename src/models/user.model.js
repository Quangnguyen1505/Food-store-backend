const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';
const userSchema = new Schema({
    name:{
        type:String,
        trim:true,
        required: true,
        maxLength:150
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    address:{
        type:String,
    },
    resetPasswordToken: {
        type: String,
        default: ''
    },
     resetPasswordExpires: {
         type: Date,
    },
    status:{
        type:String,
        enum: ['active','inactive'],
        default:'inactive'
    },
    avatarUrl:{
        type:String,
        default: null
    },
    verfify:{
        type:Schema.Types.Boolean,
        default:false
    },
    resetPasswordToken: {
       type: String,
       default: ''
    },
    resetPasswordExpires: {
        type: Date,
     },
    roles:{
        type: Schema.Types.ObjectId,
        ref: 'Role'
    }
},{
    timestamps:true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
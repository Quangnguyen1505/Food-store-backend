const mongoose = require('mongoose');
const { db: { username, password, namedb }} = require('../config/config.mongodb')
const MONGODB_URL_STRING = `mongodb+srv://${username}:${password}@cluster0.e8k4xen.mongodb.net/${namedb}`;
console.log(MONGODB_URL_STRING);
class ConnectMongoDB {
    constructor(){
        this.connect();
    }

    connect(){
        if(1==1){
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true});
        }

        mongoose.connect(`${MONGODB_URL_STRING}`).then(()=>{
            console.log("mongoose connect successfully!!");
        }).catch((e)=>{
            console.log("mongoose connect failed!!");
        })
    }

    static getInstance(){
        if(!ConnectMongoDB.instance){
            ConnectMongoDB.instance = new ConnectMongoDB();
        }

        return ConnectMongoDB.instance;
    }
}

const instanceMongoDB = ConnectMongoDB.getInstance();
module.exports = instanceMongoDB
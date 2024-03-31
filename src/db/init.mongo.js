const mongoose = require('mongoose');
const MONGODB_URL = process.env.MONGODB_URL;

class ConnectMongoDB {
    constructor(){
        this.connect();
    }

    connect(){
        if(1==1){
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true});
        }

        mongoose.connect(`${MONGODB_URL}`).then(()=>{
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
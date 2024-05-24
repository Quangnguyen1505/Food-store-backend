const redis = require('redis');

class ConnectRedis {
    constructor(){
        this.client = redis.createClient();
        this.connect();
    }
    connect(){
        this.client.connect().then(()=> {
            console.log("redis connected successfully");
        }).catch((e)=>{
            console.log("redis connect failed!!");
        })
    }

    static getInstance(){
        if(!ConnectRedis.instance){
            ConnectRedis.instance = new ConnectRedis();
        }

        return ConnectRedis.instance.client;
    }
}

const client = ConnectRedis.getInstance();

module.exports = client;
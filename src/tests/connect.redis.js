const redis = require("redis");
const connectRedis = async () => {
    
    const client = redis.createClient();

    client.on("error", function(error) {
    console.error(error);
    });

    client.on("connect", () => {
        console.log("connect")
    })
    client.get("key", redis.print);
}


module.exports = connectRedis;


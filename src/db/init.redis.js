const redis = require('redis');

let client = {}, statusConnectRedis = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error"
}

const handleEventConnection = ({
    connectionRedis
}) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`connection redis - connection status: connected`);
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connection redis - connection status: disconnected`);
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connection redis - connection status: reconnecting`);
    })

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connection redis - connection status: error ${err}`);
    })

}

const initRedis = () => {
    const instanceRedis = redis.createClient({
        url: process.env.REDIS_URI
    });
    client.instanceConnect = instanceRedis;
    handleEventConnection({
        connectionRedis: instanceRedis
    })
}

const getRedis = () => client

const closeRedis = () => {

}

module.exports = {
    initRedis,
    getRedis,
    closeRedis
}
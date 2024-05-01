const dev = {
    db: {
        namedb: process.env.DEV_DB_NAME,
        username: process.env.DEV_DB_USERNAME,
        password: process.env.DEV_DB_PASSWORD
    }
}

module.exports = dev;
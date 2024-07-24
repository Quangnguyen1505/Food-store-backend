const express = require('express');
const app = express();
require('dotenv').config();
var morgan = require('morgan');
var helmet =require('helmet');
var compression = require('compression')
const cors = require('cors');
const socketConfig = require('./config/io.config');

//init middelwares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(cors());

//init db
require('./db/init.mongo');
require('./db/init.redis');

//apply socket io 
const server = require('http').createServer(app);
socketConfig.init(server);

//init routes
app.use('/', require('./routes'));

//handling error
app.use(( req, res, next ) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use(( error, req, res, next ) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: "error",
        message: error.message,
        stack: error.stack,
        code: statusCode
    })
});

// require('./config/socket-io.config')(io);


module.exports = server;
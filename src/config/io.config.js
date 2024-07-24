// config/socket-io.config.js
let io;

module.exports = {
    init: function(server) {
        io = require('socket.io')(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
              } 
        });
        io.on('connection', (socket) => {
            console.log('a user connected', socket.id);
            
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
        return io;
    },
    getIO: function() {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    }
};

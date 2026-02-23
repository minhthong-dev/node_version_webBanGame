const socket = require('socket.io');
const server = require('http').createServer();
const io = socket(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
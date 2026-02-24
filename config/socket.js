
const { Server } = require('socket.io');

const io = new Server({
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});
const socketApi = {
    io: io
};

socketApi.sendHello = function () {
    io.sockets.emit('hello', 'Hello from server');
}

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('send_message', (message) => {
        console.log(message);
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

module.exports = socketApi;
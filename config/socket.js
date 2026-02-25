
const { Server } = require('socket.io');
const checkAdmin = require('../utils/checkAdmin');
const io = new Server({
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
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
    socket.on('iam_admin', (data) => {
    })
    if (checkAdmin(socket.handshake.auth.token)) {
        socket.emit('admin_check', true);
        socket.join('admin_room');
    }
    socket.on('join_room', (data) => {
        console.log("join_room: ", data);
        socket.join(data.room);
        socket.broadcast.emit('new_user_waiting', {
            room: data.room,
            data: data
        });
    });
    socket.on('send_message', (data) => {
        console.log("send_message: ", data);
        // socket.to(data.room).emit('receive_message', data);
        socket.to('admin_room').emit('receive_user_message', data);
    });
    socket.on('admin_message', (data) => {
        console.log("admin_message: ", data);
        socket.to(data.room).emit('receive_admin_message', data);
    })
});

module.exports = socketApi;
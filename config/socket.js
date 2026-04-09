
const { Server } = require('socket.io');
const checkAdmin = require('../utils/checkAdmin');
const io = new Server({
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174", "https://adminwebbangame.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true
    }
});
const historyChatService = require('../services/historyChatService');
const socketApi = {
    io: io
};

socketApi.sendHello = function () {
    io.sockets.emit('hello', 'Hello from server');
}
const onlineUser = new Map();
io.on('connection', (socket) => {
    socket.on('user_infor_connected', (data) => {
        //console.log("user_infor_connected: ", data);
        onlineUser.set(socket.id, data);
        //console.log("onlineUser: ", onlineUser);

    })
    console.log('a user connected', socket.id);
    //io.emit('new_user_connected', onlineUser);
    //console.log('thong bao user moi', onlineUser)
    socket.on('send_message', (message) => {
        console.log(message);
    })
    socket.on('user_logout', (data) => {
        console.log("user_logout: ", data);
        onlineUser.delete(socket.id);
        // console.log("onlineUser: ", onlineUser);
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
        onlineUser.delete(socket.id);
        // console.log("onlineUser: ", onlineUser);
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
        onlineUser.set(socket.id, data);
    });
    socket.on('send_message', (data) => {
        try {
            historyChatService.addMessUser(data);
        } catch (error) {
            return error;
        }
        console.log("send_message: ", data);
        // socket.to(data.room).emit('receive_message', data);
        socket.to('admin_room').emit('receive_user_message', data);
    });
    socket.on('admin_message', (data) => {
        historyChatService.addMessAdmin(data);
        console.log("admin_message: ", data);
        socket.to(data.room).emit('receive_admin_message', data);
    })

    socket.on('user_online_list', (data) => {
        console.log("user_online_list: ", data);
        const ArryUser = Array.from(onlineUser.values());
        io.emit('receive_user_online_list', ArryUser);
        console.log("onlineUser: ", ArryUser);
    })
    socket.on('user_block', (data) => {
        console.log("user_block: ", data);
        // let targetId = null;
        // try {
        //     for (const [key, value] of onlineUser) {
        //         console.log("value: ", value.data);
        //         // console.log("key: ", key);
        //         if (value.data.userId === data.id) {
        //             targetId = key;
        //         }
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
        //console.log("targetId: ", targetId);
        if (data) {
            console.log("targetId: ", data);
            socket.emit('receive_user_block', 'may da bi block roi con chos', data);
        }
    })

});

module.exports = socketApi;
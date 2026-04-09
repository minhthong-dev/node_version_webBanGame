
const { Server } = require('socket.io');
const checkAdmin = require('../utils/checkAdmin');
// Bỏ import userService ở top-level để tránh circular dependency
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

    socket.on('isBlock', async (data) => {
        console.log("isBlock: ", data);
        const userId = data.data.id;
        if (userId) {
            try {
                const userService = require('../services/userService');
                const isBlock = await userService.isUserBlock(userId);
                console.log("isBlock: ", isBlock);
                if (isBlock === true) {
                    setTimeout(() => {
                        socket.emit('receive_user_block', { id: userId, message: "m bi khoa roi con chos" });
                        console.log("da gui block toi user")
                    }, 1000);
                }
            } catch (error) {
                console.error("Lỗi khi check isBlock:", error);
            }
        }
    })

    socket.on('user_online_list', (data) => {
        console.log("user_online_list: ", data);
        const ArryUser = Array.from(onlineUser.values());
        io.emit('receive_user_online_list', ArryUser);
        console.log("onlineUser: ", ArryUser);
    })
    socket.on('user_block', (data) => {
        console.log("user_block: ", data);
        if (data) {
            console.log("targetId: ", data);
            try {
                io.emit('receive_user_block', { id: data.userId, message: "m bi khoa roi con chos" });
                console.log("da gui emit tới tất cả payload: ", { id: data.userId, message: "Tài khoản của bạn đã bị khóa" })
            } catch (error) {
                return error
            }
        }
    })

});

module.exports = socketApi;
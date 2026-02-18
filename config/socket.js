const socket = require('socket.io');
const server = require('http').createServer();
const io = socket(server);

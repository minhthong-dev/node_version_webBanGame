var express = require("express")
var mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const historyChatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [messageSchema]
});

module.exports = mongoose.model('historychat', historyChatSchema)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    avatar: { type: String },
    themePic: { type: String },
    isVerified: {
        type: Boolean,
        default: null
    },
    verifyToken: {
        type: String,
        default: null
    },
    verifyTokenExpiry: {
        type: Date,
        default: null
    }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);
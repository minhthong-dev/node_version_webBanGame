const mongoose = require('mongoose');
const bycrypt = require('bcrypt');
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
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });
//bam mat khau
userSchema.pre('save', async function () {
    try {
        if (this.isModified('password')) {
            const salt = await bycrypt.genSalt(10);
            this.password = await bycrypt.hash(this.password, salt);
        }
        
    } catch (err) {
        throw err;
    }
});
// export
module.exports = mongoose.model("User", userSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Manager: Number,
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema, 'users');
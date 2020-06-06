const mongoose = require('mongoose');
const User = require('./user');

const taskSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    _user: {
        type: String,
        ref: User
    }
}, { timestamps: true });

module.exports = mongoose.model('task', taskSchema);
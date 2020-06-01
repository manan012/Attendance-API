const mongoose = require('mongoose');
const User = require('./user');

const taskSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
}, { timestamps: true });

module.exports = mongoose.model('task', taskSchema);

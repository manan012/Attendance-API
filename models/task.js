const mongoose = require('mongoose');
const User = require('./user');
const Modules = require('./modules');

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
    },
    _module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Modules
    }
}, { timestamps: true });

module.exports = mongoose.model('task', taskSchema);
const mongoose = require('mongoose');
const Task = require('./task');
const User = require('./user');

const moduleSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    _task: [{
        type: String,
        ref: Task
    }],
    _member: [{
        type: String,
        ref: User,
    }]
}, { timestamps: true });

module.exports = mongoose.model('module', moduleSchema);
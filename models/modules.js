const mongoose = require('mongoose');
const Task = require('./task');
const User = require('./user');

const moduleSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: true
    },
    _task: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Task
    }],
    _member: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    }]
}, { timestamps: true });

module.exports = mongoose.model('module', moduleSchema);

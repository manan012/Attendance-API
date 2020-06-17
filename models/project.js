const mongoose = require('mongoose');
const User = require('./user');
const Task = require('./task');

const projectSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User,
    },
    _tasks: [{
        type: String,
        ref: Task
    }],
    _members: [{
        type: String,
        ref: User,
    }]

}, { timestamps: true });

module.exports = mongoose.model('project', projectSchema);
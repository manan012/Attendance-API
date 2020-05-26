const mongoose = require('mongoose');
const Task = require('./task');
const Project1 = require('./project');

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
    _project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Project1
    }
}, { timestamps: true });

module.exports = mongoose.model('module', moduleSchema);

const mongoose = require('mongoose');
const Task = require('./task');

const kanbanSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: true
    },
    _task: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    _user: [{
        type: mongoose.Schema.Types.ObjectId
    }]
}, {timestamps: true});

module.exports = mongoose.model('kanban', kanbanSchema);

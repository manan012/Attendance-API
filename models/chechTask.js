const mongoose = require('mongoose');
const User = require('./user');

const checkTaskSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    employeeId: {
        type: String,
        required: true,
        ref: User
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('checkTask', checkTaskSchema);
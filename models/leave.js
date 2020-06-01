const mongoose = require('mongoose');

const leaveSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    employeeId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        default: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    }

}, { timestamps: true });

module.exports = mongoose.model('leave', leaveSchema);

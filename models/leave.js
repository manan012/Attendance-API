const mongoose = require('mongoose');

const leaveSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    employeeId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    dateTo: {
        type: String,
        required: true
    },
    dateFrom: {
        type: String,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('leave', leaveSchema);
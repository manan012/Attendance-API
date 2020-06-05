const mongoose = require('mongoose');

const editDetailSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
    employeeId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    category: {
        type: String,
    },
    role: {
        type: String,
    }

}, { timestamps: true });

module.exports = mongoose.model('editDetail', editDetailSchema);
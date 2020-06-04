const mongoose = require('mongoose');
const User = require('./user');

const attendanceSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    present: {
        type: Boolean,
        required: true
    },
    onLeave: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Number,
        required: true,
    },
    _user: {

        type: String,
        ref: User

    },
});

module.exports = mongoose.model('Attendance', attendanceSchema);

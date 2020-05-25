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
        required: true
    },
    date: {
        type: String,
        required: true,
    },
    _user: {
      
        type: mongoose.Schema.Types.ObjectId,
        ref: User
       
    },
},{timestamps: true});

module.exports = mongoose.model('Attendance', attendanceSchema);

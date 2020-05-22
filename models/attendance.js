const mongoose = require('mongoose');
const User = require('./user');

const attendanceSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    present: [{
        type: String,
        required: true
    }],
    onLeave: [{
        type: String,
        required: true
    }],
    date: {
        type: String,
        required: true
    },
    _user: [{
      
        type: mongoose.Schema.Types.ObjectId,
        ref: User
       
    }]

});

module.exports = mongoose.model('Attendance', attendanceSchema);

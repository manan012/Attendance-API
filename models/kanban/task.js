const mongoose = require('mongoose');
const User = require('../user')

const taskSchema = mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    assignees: [String],
    rank: {
        type: Number,
        required: "Rank Required"
    },
    bucket: {
        type: String,
        required: "Bucket Name Required"
    },
    checklist: [Object],
    start_date: {
        type: Date
    },
    due_date: {
        type: Date
    },
    progress: {
        type: String
    },
    label_color: {
        type: String
    },
    priority: {
        type: String
    },
    attachments: [String],
    _user: {
        type: String,
        ref: User
    }
}, { timestamps: true });

module.exports = mongoose.model('tasks', taskSchema);
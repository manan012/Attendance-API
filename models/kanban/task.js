const mongoose = require('mongoose');
const Bucket = require('./bucket');
var taskSchema = mongoose.Schema({
    projectId: {
        type: mongoose.Types.ObjectId,

    },
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    assignees: [String],
    rank: {
        type: Number,
        required: "Rank Required",
    },
    bucket: {
        type: mongoose.Schema.Types.ObjectId,
	ref: Bucket
    },
    checklist: [Object],
    start_date: {
        type: Date,
    },
    due_date: {
        type: Date,
    },
    progress: {
        type: String,
    },
    label_color: {
        type: String,
    },
    priority: {
        type: String,
    },
    attachments: [String],
});
module.exports = mongoose.model("tasks", taskSchema);

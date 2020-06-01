const mongoose = require('mongoose');
const User = require('./user');
const Module = require('./modules');
const projectSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User,
    },
    _modules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Module,
    }],
    _members: [{
        type: String,
        ref: User,
    }]

}, { timestamps: true });

module.exports = mongoose.model('project', projectSchema);

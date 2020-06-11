const mongoose = require('mongoose');
const User = require('../user');

const bucketSchema = mongoose.Schema({
    name: {
        type: String,
        required: "Bucket Name required"
    },
    rank: {
        type: Number
    },
    _user: {
        type: String,
        ref: User
    }
})

module.exports = mongoose.model('buckets', bucketSchema)
const mongoose = require("mongoose");
const Project = require("../project");
var bucketSchema = mongoose.Schema({
    name: {
        type: String,
        required: "Bucket Name required",
    },
    rank: {
        type: Number,
    },
    projectId: {
        type: mongoose.Types.ObjectId,
        ref: Project
    },
});
module.exports = mongoose.model("buckets", bucketSchema);
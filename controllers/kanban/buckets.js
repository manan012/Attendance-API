const express = require("express");
const router = express.Router();
const Bucket = require("../../models/kanban/bucket");
const Task = require("../../models/kanban/task")
const { update } = require("../../models/kanban/bucket");
const task = require("../../models/kanban/task");

exports.getBucket = (req, res) => {
    Bucket.find({ projectId: req.params.projectId }, { __v: 0 }, { sort: { rank: 1 } },
        (err, docs) => {
            if (!err) {
                res.json(docs);
            } else {
                console.log(err);
                res.json(err);
            }
        }
    );
};
/*
{
    bucket:{
        rank: 1,
        projectId: something,
        _id: something
    }
}
*/

exports.deleteBucket = async(req, res) => {
    const bucket = req.body.bucket
    let rank = bucket.rank
    console.log(bucket)
    try {
        const updateManyResult = await Bucket.updateMany({ projectId: bucket.projectId, rank: { $gt: rank } }, { $inc: { rank: -1 } })
        console.log(updateManyResult)
        const deletedTasks = await Task.deleteMany({ bucket: bucket._id })
        const deleted = await Bucket.deleteOne({ _id: bucket._id })
        if (deleted && deletedTasks) {
            res.json({ message: "Deleted" })
        }
    } catch (err) {
        res.json(err)
    }

}

/*
{
    bucket:{
        rank: 1,
        name: new name,
        _id: something
    }
}
*/
exports.editBucket = async(req, res) => {
    const bucket = req.body.bucket
    try {
        const updatedResult = await Bucket.updateOne({ _id: bucket._id }, {
            $set: {
                name: bucket.name,
                rank: bucket.rank
            }
        })
        if (updatedResult.nModified > 0) {
            res.json({ "message": "modified" })
        } else {
            res.json({ "message": "not modified" })
        }
    } catch (err) {
        res.json(err)
    }
}

/*
{
    bucket1:{
        rank: 1,
        _id: something
    },

    bucket2:{
        rank: 1,
        _id: something
    }
}
*/

exports.bucketSwap = async(req, res) => {
    const bucket1 = req.body.bucket1
    const bucket2 = req.body.bucket2
    console.log(bucket1)
    console.log(bucket2)
    try {
        const updateBucket1 = await Bucket.updateOne({ _id: bucket1._id }, { $set: { rank: bucket1.rank } })
        const updateBucket2 = await Bucket.updateOne({ _id: bucket2._id }, { $set: { rank: bucket2.rank } })
        console.log(updateBucket1)
        console.log(updateBucket2)
        if (updateBucket1 && updateBucket2) {
            res.json({ message: "updated" })
        }
    } catch (err) {
        res.json(err)
    }

}

/*
{
    bucket:{
        rank: 1,
        projectId: something,
        name: projectName
    }
}
*/

exports.addBucket = (req, res) => {
    const bucket = req.body.bucket
    let newbucket = new Bucket(bucket)
    newbucket.save((err, docs) => {
        if (!err) {
            res.json({ message: "Bucket added" })
        } else {
            res.json(err)
        }
    })
}

exports.saveBucket = (req, res) => {
    const buckets = req.body.buckets;
    const projectId = req.body.projectId;
    //Delete bucket if database contains a bucket not in buckets
    Bucket.find({ projectId }, (err, docs) => {
        docs.forEach((doc) => {
            var found = false;
            for (var key in buckets) {
                var bucket = buckets[key];
                if (bucket === doc.name) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                Bucket.deleteOne({ name: doc.name }, (err, docs) => {
                    if (!err) {
                        console.log("Deleted Bucket");
                    } else {
                        res.json(err);
                    }
                });
            }
        });
    });
    var rank = 1;
    for (var key in buckets) {
        // const bucket = { rank: rank, name: buckets[key].name, id: buckets[key].id }
        const bucket = { rank: rank, name: buckets[key], projectId: projectId };
        console.log(buckets);
        rank += 1;
        Bucket.updateOne({ projectId: projectId, name: bucket.name },
            bucket, { upsert: true },
            (err, docs) => {
                if (!err) {
                    console.log("Updated buckets");
                } else {
                    res.json(err);
                }
            }
        );
    }
    res.json({ message: "okay" });
}
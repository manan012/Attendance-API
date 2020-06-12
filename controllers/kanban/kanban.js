const mongoose = require('mongoose');
const Task = require('../../models/kanban/task')
const Bucket = require('../../models/kanban/bucket')
const multer = require('multer')
const fs = require('fs')

//Task controllers
exports.getAllTasks = (req, res, next) => {
    const _user = req.params.userId

    var dataToSend = {}
    Task.find({ _user: _user }, (err, docs) => {
        if (!err) {
            docs.forEach(doc => {
                dataToSend[doc.id] = doc
            })
            res.json(dataToSend)
        }
        else {
            res.json(err)
        }
    })
}

exports.saveTask = (req, res, next) => {
    const tasks = req.body.tasks
    const _user = req.body._user
    //Delete from database if task not in tasks
    //Also delete any attachments not present
    Task.find({ _user: _user }, (err, docs) => {
        docs.forEach(doc => {
            var found = false
            for (var key in tasks) {
                var task = tasks[key]
                if (doc.id === task.id) {
                    found = true
                    doc.attachments.forEach(attachment => {
                        console.log("In delete")
                        if (!task["attachments"].includes(attachment)) {
                            try {
                                fs.unlinkSync('./uploads/' + attachment)
                                console.log("File Deleted")
                            }
                            catch (err) {
                                console.log(err)
                            }
                        }
                    })
                    break
                }
            }
            if (!found) {
                Task.deleteOne({ _user: _user, id: doc.id }, (err, docs) => {
                    if (!err) {
                        console.log("Deleted task")
                    }
                    else {
                        res.json(err)
                    }
                })
            }
        })
    })

    //Insert into database if task in tasks or update if required
    for (var key in tasks) {
        var task = tasks[key]
        Task.findOneAndUpdate({ _user, _user, id: task.id }, task, { upsert: true }, (err, docs) => {
            if (!err) {
                if (docs) {
                    docs.toObject()
                    for (var key in docs) {
                        if (task[key] && docs[key] !== task[key] || key === "checklist") {
                            Task.update({ id: task["id"] }, { $set: { key: task[key] } }, (err, docs) => {
                                if (err) {
                                    res.json(err)
                                }
                            })
                        }
                    }
                }
            }
            else {
                res.json(err)
            }
        })
    }
    res.json({ "message": "saved" })
}

//Buckets controllers
exports.getAllBuckets = (req, res, next) => {
    Bucket.find({ _user: req.params.userId }, { _id: 0, __v: 0 }, { sort: { rank: 1 } }, (err, docs) => {
        if (!err) {
            res.json(docs)
        }
        else {
            console.log(err)
            res.json({ "error": err })
        }

    })
}
exports.saveBucket = (req, res, next) => {
    const buckets = req.body.buckets
    const _user = req.body._user
    //Delete bucket if database contains a bucket not in buckets
    Bucket.find({ _user: _user }, (err, docs) => {
        docs.forEach(doc => {
            var found = false
            for (var key in buckets) {
                var bucket = buckets[key]
                if (bucket === doc.name) {
                    found = true
                    break
                }
            }
            if (!found) {
                Bucket.deleteOne({ _user: _user, name: doc.name }, (err, docs) => {
                    if (!err) {
                        console.log("Deleted Bucket")
                    }
                    else {
                        res.json(err)
                    }
                })
            }
        })
    })
    var rank = 1
    for (var key in buckets) {
        // const bucket = { rank: rank, name: buckets[key].name, id: buckets[key].id }
        const bucket = { rank: rank, name: buckets[key] }

        console.log(buckets)
        rank += 1
        Bucket.findOneAndUpdate({ _user: _user, name: bucket.name }, bucket, { upsert: true }, (err, docs) => {
            if (!err) {
                console.log(docs)
            }
            else {
                res.json(err)
            }
        })
    }
    res.json({ "message": "saved" })
}

//File controllers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})
const upload = multer({ storage: storage })

exports.saveFiles = upload.array('attachments', 10), (req, res) => {
    const id = req.body.id
    const _user = req.body._user
    const files = req.files
    console.log(files)
    var attachments = []
    files.forEach(file => {
        attachments.push(file.filename)
    })
    Task.updateOne({ _user: _user, id: id }, { $set: { attachments: attachments } }, (err, docs) => {
        if (!err) {
            if (docs.nModified !== 0) {
                res.json({ "message": "uploaded" })
            }
            else {
                res.json({ "message": "task does not exist" })
            }
        }
        else {
            res.json(err)
        }
    })
}
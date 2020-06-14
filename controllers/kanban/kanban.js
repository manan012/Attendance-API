const mongoose = require('mongoose');
const Task = require('../../models/kanban/task')
const Bucket = require('../../models/kanban/bucket')
const User = require('../../models/user');
const multer = require('multer')
const fs = require('fs')

//Task controllers
exports.getAllTasks = (req, res, next) => {
    //const _user = req.params.userId;
    const _user = req.userId;
    var dataToSend = {}
    User.findById(_user)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'user not found'
                })
            } else {
                Task.find({ _user: _user }, (err, docs) => {
                    if (!err) {
                        docs.forEach(doc => {
                            dataToSend[doc.id] = doc
                        })
                        res.json(dataToSend)
                    } else {
                        res.json(err)
                    }
                })
            }

        })
        .catch(error => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
        })

}

exports.saveTask = (req, res, next) => {
    const tasks = req.body.tasks
    const userId = req.userId;
    console.log(userId)
    //Delete from database if task not in tasks
    //Also delete any attachments not present
    User.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'user not found'
                })
            } else {

                Task.find({ _user: userId }, (err, docs) => {
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
                                        } catch (err) {
                                            console.log(err)
                                        }
                                    }
                                })
                                break
                            }
                        }
                        if (!found) {
                            Task.deleteOne({ _user: userId, id: doc.id }, (err, docs) => {
                                if (!err) {
                                    console.log("Deleted task")
                                } else {
                                    res.json(err)
                                }
                            })
                        }
                    })
                })

                //Insert into database if task in tasks or update if required
                for (var key in tasks) {
                    var task = tasks[key]
                    Task.findOneAndUpdate({ _user: userId, id: task.id }, task, { upsert: true }, (err, docs) => {
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
                        } else {
                            res.json(err)
                        }
                    })
                }
            }

        })
        .catch(error12 => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
        })

}

//Buckets controllers
exports.getAllBuckets = (req, res, next) => {
    const _userId = req.userId;
    User.findById(_userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'user not found'
                })
            } else {
                Bucket.find({ _user: _userId }, { _id: 0, __v: 0 }, { sort: { rank: 1 } }, (err, docs) => {
                    if (!err) {
                        res.json(docs)
                    } else {
                        console.log(err)
                        res.json({ "error": err })
                    }

                })
            }
        })
        .catch(error => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
        })

}
exports.saveBucket = (req, res, next) => {
    const buckets = req.body.buckets
    const userId = req.userId;
    User.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'User not found'
                })
            } else {
                //Delete bucket if database contains a bucket not in buckets
                Bucket.find({ _user: userId }, (err, docs) => {
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
                                } else {
                                    res.json(err)
                                }
                            })
                        }
                    })
                })
                //Insert/Update any changes to the bukcets or any new bucket
                var rank = 1
                for (var key in buckets) {
                    // const bucket = { rank: rank, name: buckets[key].name, id: buckets[key].id }
                    const bucket = { rank: rank, name: buckets[key] }

                    console.log(buckets)
                    rank += 1
                    Bucket.findOneAndUpdate({ _user: userId, name: bucket.name }, bucket, { upsert: true }, (err, docs) => {
                        if (!err) {
                            console.log(docs)
                        } else {
                            res.json(err)
                        }
                    })
                }
                res.json({ "message": "saved" })


            }
        })
        .catch(error => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
        })

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

exports.uploadFiles = upload.array('attachments', 10)

exports.saveFiles = (req, res) => {
    const id = req.body.id
    const _user = req.body._user
    const files = req.body.files
    const userId = req.userId;
    console.log(files)
    var attachments = []
    files.forEach(file => {
        attachments.push(file.filename)
    })

    User.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'user not found'
                })
            } else {
                Task.updateOne({ _user: _user, id: id }, { $set: { attachments: attachments } }, (err, docs) => {
                    if (!err) {
                        if (docs.nModified !== 0) {
                            res.json({ "message": "uploaded" })
                        } else {
                            res.json({ "message": "task does not exist" })
                        }
                    } else {
                        res.json(err)
                    }
                })
            }
        })
        .catch(error => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
        })
}
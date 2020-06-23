const express = require("express");
const router = express.Router();
const Task = require("../../models/kanban/task");

exports.getTask = (req, res) => {
    const projectId = req.params.projectId;
    var dataToSend = {};
    Task.find({ projectId: projectId }).populate('bucket').exec((err, docs) => {
        if (!err) {
            docs.forEach((doc) => {
                dataToSend[doc._id] = doc;
            });
            res.json(dataToSend);
        } else {
            res.json(err);
        }
    });
}

/*
{
    "tasks": {
        projectId: something,
        name: something,
        description: something,
        assignees: something array
        rank: something number required
        bucket: something
        checklist: something array
        start_date: something date
        due_date: something date
        progress: something
        label_color: something
        priority: something
        attachments: something array
    }
}
*/
exports.addTask = async(req, res) => {
    const { task } = req.body
    const newTask = new Task(task)
    try {
        const insertResult = await newTask.save()
        if (insertResult) {
            res.json({ message: "added" })
        } else {
            res.json({ message: "not added" })
        }
    } catch (err) {
        res.json(err)
    }
}

/*
{
    "task":{
        _id: something,
        name: something,
        description: something,
        assignees: something array
        rank: something number required
        bucket: {
            _id: something
        }
        checklist: something array
        start_date: something date
        due_date: something date
        progress: something
        label_color: something
        priority: something
        attachments: something array

    }
}
*/
exports.editTask = async(req, res) => {
    const task = req.body.task
    try {
        const updatedResult = await Task.updateOne({ _id: task._id }, {
            $set: {
                name: task.name,
                description: task.description,
                assignees: task.assignees,
                rank: task.rank,
                bucket: task.bucket._id,
                checklist: task.checklist,
                start_date: task.start_date,
                due_date: task.due_date,
                progress: task.progress,
                label_color: task.label_color,
                priority: task.priority,
                attachments: task.attachments
            }
        })
        res.json({ message: "Updated" })
    } catch (err) {
        res.json(err)
    }
}

/*
{
    "task":{
        _id: something
        rank: something number,
        projectId: something,
        bucket: {
            _id: something
        }

    }
}
*/
exports.deleteTask = async(req, res) => {
    const task = req.body.task
    const rank = task.rank
    try {
        const updateManyResult = await Task.updateMany({ projectId: task.projectId, bucket: task.bucket._id, rank: { $gt: rank } }, { $inc: { rank: -1 } })
        const deleted = await Task.deleteOne({ _id: task._id })
        if (deleted) {
            res.json({ message: "Deleted" })
        }
    } catch (err) {
        res.json(err)
    }
}

/*
{
    "task1":{
        _id: something,
        rank: something number
    },
    "task2":{
        _id: something,
        rank: something number
    }
}
*/
exports.taskSwap = async(req, res) => {
    const task1 = req.body.task1
    const task2 = req.body.task2
    console.log(task1)
    console.log(task2)
    try {
        const updateTask1 = await Task.updateOne({ _id: task1._id }, { $set: { rank: task1.rank } })
        const updateTask2 = await Task.updateOne({ _id: task2._id }, { $set: { rank: task2.rank } })
        console.log(updateTask1)
        console.log(updateTask2)
        if (updateTask1 && updateTask2) {
            res.json({ message: "updated" })
        }
    } catch (err) {
        res.json(err)
    }

}
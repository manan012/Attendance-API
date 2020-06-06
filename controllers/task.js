const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/user');
const Tasks = require('../models/task');
const url = require('url');

exports.generateTask = (req, res, next) => {
    // const userId = req.params.userId;
    const adminId = req.userId;

    Users.findById(adminId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'Admin Not found'
                })
            } else {
                if (success.role == 'admin') {
                    const task = new Tasks();
                    task._id = new mongoose.Types.ObjectId(),
                        task.title = req.body.title;
                    task.description = req.body.description;
                    if (req.body.user != null) {
                        task._user = req.body.user;
                    }


                    task.save()
                        .then(result => {
                            console.log(result);
                            return res.status(201).json({
                                success: "true",
                                message: "Task successfully created",
                                taskId: result._id
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).json({
                                success: "false",
                                message: "Some error Occurred"
                            });
                        });

                } else {
                    return res.status(401).json({
                        success: 'false',
                        message: 'Unauthorized Access'
                    })
                }


            }
        })
        .catch(err => {
            return res.status(500).json({
                success: "false",
                message: "Some error occurred"
            })
        })

}


exports.editTask = (req, res, next) => {

    const adminId = req.userId;
    const taskId = req.params.taskId;
    // const title = req.body.title;
    // const desc = req.body.description;

    Users.findById(adminId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'Admin Not found'
                })
            } else {
                if (success.role == 'admin') {
                    Tasks.findById(taskId)
                        .then(result => {
                            if (result == null || result.length < 1) {
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'Task not found'
                                })
                            } else {
                                if (req.body.title != null) {
                                    result.title = req.body.title;

                                }
                                if (req.body.description != null) {
                                    result.description = req.body.description;
                                }
                                if (req.body.user != null) {
                                    result._user = req.body.user;
                                }

                                result.save()
                                    .then(result1 => {
                                        return res.status(200).json({
                                            success: 'true',
                                            message: 'Task successfully updated'
                                        })
                                    })
                                    .catch(error1 => {
                                        console.log(error1);

                                        return res.status(500).json({
                                            success: 'false',
                                            message: 'Some error occurred'
                                        })
                                    })
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred'
                            })
                        })
                } else {
                    return res.status(401).json({
                        success: 'false',
                        message: 'Unauthorized'
                    })
                }
            }
        })
        .catch(err => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error has occurred'
            })
        })
}


exports.deleteTask = (req, res, next) => {

    const adminId = req.userId;
    const taskId = req.params.taskId;

    Users.findById(adminId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'Admin Not found'
                })
            } else {
                if (success.role == 'admin') {
                    Tasks.findById(taskId)
                        .then(result => {
                            if (result == null || result.length < 1) {
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'Task not found'
                                })
                            } else {
                                Tasks.findByIdAndDelete(taskId)
                                    .then(result1 => {
                                        return res.status(200).json({
                                            success: 'true',
                                            message: 'Task successfully deleted'
                                        })
                                    })
                                    .catch(error1 => {
                                        return res.status(500).json({
                                            success: 'false',
                                            message: 'Some error occurred'
                                        })
                                    })
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred'
                            })
                        })
                } else {
                    return res.status(401).json({
                        success: 'false',
                        message: 'Unauthorized Access'
                    })
                }
            }
        })
        .catch(err => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error has occurred'
            })
        })
}

exports.getTask = (req, res, next) => {

    const userId = req.userId;
    const employeeId = req.employeeId;
    Users.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'User Not found'
                })
            } else {
                Tasks.find({ _user: employeeId }, { title: true, description: true })
                    .then(result => {
			console.log(result);
                        if (result == null || result.length < 1) {
                            return res.status(404).json({
                                success: 'false',
                                message: 'Task not found'
                            })
                        } else {
                            return res.status(200).json({
                                success: 'true',
                                message: 'Task Found',
                                task: result
                            })

                        }
                    })
                    .catch(err => {
                        return res.status(500).json({
                            success: 'false',
                            message: 'Some error occurred'
                        })
                    })

            }
        })
        .catch(err => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error has occurred'
            })
        })

}

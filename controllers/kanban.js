const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/user');
const Tasks = require('../models/task');
const Kanbans = require('../models/kanban');
const url = require('url');

exports.createKanban = (req, res, next) => {
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
                    const kanban = new Kanbans();
                    kanban._id = new mongoose.Types.ObjectId();
                    kanban.name = req.body.name;
                    if (req.body.task != null) {
                        kanban._task = req.body.task;
                    }

                    if (req.body.user != null) {
                        kanban._user = req.body.user;
                    }

                    kanban.save()
                        .then(result => {
                            console.log(result);
                            return res.status(201).json({
                                success: "true",
                                message: "Kanban board successfully created",
                                kanbanBoardId: result._id
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

exports.editKanban = (req, res, next) => {

    const adminId = req.userId;
    const boardId = req.params.boardId;
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
                    Kanbans.findById(boardId)
                        .then(result => {
                            if (result == null || result.length < 1) {
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'Kanban board not found'
                                })
                            } else {
                                if (req.body.name != null) {
                                    result.name = req.body.name;
                                }
                                if (req.body.task != null) {
                                    result._task = req.body.task;
                                }
                                if (req.body.user != null) {
                                    result._user = req.body.user;
                                }

                                result.save()
                                    .then(result1 => {
                                        return res.status(200).json({
                                            success: 'true',
                                            message: 'Kanban board successfully updated'
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
                            console.log(err);
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
            console.log(err);

            return res.status(500).json({
                success: 'false',
                message: 'Some error has occurred'
            })
        })
}

exports.deleteKanban = (req, res, next) => {

    const adminId = req.userId;
    const boardId = req.params.boardId;

    Users.findById(adminId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'Admin Not found'
                })
            } else {
                if (success.role == 'admin') {
                    Kanbans.findById(boardId)
                        .then(result => {
                            if (result == null || result.length < 1) {
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'Kanban board not found'
                                })
                            } else {
                                Kanbans.findByIdAndDelete(boardId)
                                    .then(result1 => {
                                        return res.status(200).json({
                                            success: 'true',
                                            message: 'Kanban board successfully deleted'
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

exports.getKanban = (req, res, next) => {

    const userId = req.userId;
    Users.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'User Not found'
                })
            } else {
                Kanbans.find({ _user: userId })
                    .then(result => {
                        if (result == null || result.length < 1) {
                            return res.status(404).json({
                                success: 'false',
                                message: 'Kanban board not found'
                            })
                        } else {
                            return res.status(200).json({
                                success: 'true',
                                message: 'Kanban board Found',
                                Kanban_Board: result
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
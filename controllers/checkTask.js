const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/user');
const CheckTask = require('../models/chechTask');
const moment = require('moment-timezone');
const dateIndia = moment.tz(Date.now(), "Asia/Kolkata");

exports.addTask = (req, res, next) => {
    const employeeId = req.employeeId;
    const userId = req.userId;
    const description = req.body.description;
    const date = dateIndia.toLocaleString();

    Users.findById(userId)
        .then(success1 => {
            if (success1 == null || success1.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'User not found'
                })
            } else {
                const ct = new CheckTask();
                ct._id = new mongoose.Types.ObjectId();
                ct.employeeId = employeeId;
                ct.description = description;
                ct.date = date;
                ct.name = success1.name;
                ct.save()
                    .then(success2 => {
                        return res.status(201).json({
                            success: 'true',
                            message: 'Task update successfully sent'
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
        .catch(error2 => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
        })
}

exports.getMyTask = (req, res, next) => {
    const userId = req.userId;
    const employeeId = req.employeeId;

    Users.findById(userId)
        .then(success1 => {
            if (success1 == null || success1.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'User not found'
                })
            } else {
                CheckTask.find({ employeeId: employeeId })
                    .then(success2 => {
                        if (success2 == null || success2.length < 1) {
                            return res.status(404).json({
                                success: 'false',
                                message: 'No Task update found'
                            })
                        } else {
                            return res.status(200).json({
                                success: 'false',
                                message: 'Task update found',
                                task: success2
                            })
                        }
                    })
                    .catch(error1 => {
                        return res.status(500).json({
                            success: 'false',
                            message: 'Some error occurred'
                        })
                    })
            }
        })
        .catch(error2 => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
        })
}

exports.getAllTask = (req, res, next) => {
    const userId = req.userId;
    Users.findById(userId)
        .then(success1 => {
            if (success1 == null || success1.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'User not found'
                })
            } else {
                if (success1.role == 'admin') {
                    CheckTask.find()
                        .then(success2 => {
                            if (success2 == null || success2.length < 1) {
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'No Task update found'
                                })
                            } else {
                                return res.status(200).json({
                                    success: 'false',
                                    message: 'Task update found',
                                    task: success2
                                })
                            }
                        })
                        .catch(error1 => {
                            return res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred'
                            })
                        })
                } else {
                    return res.status(401).json({
                        success: 'false',
                        message: 'Unauthorized access'
                    })
                }

            }
        })
        .catch(error2 => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
        })
}
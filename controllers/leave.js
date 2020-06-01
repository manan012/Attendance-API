const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/user');
const Leaves = require('../models/leave');

exports.addRecord = (req, res, next) => {
    const employeeId = req.employeeId;
    const userId = req.userId;
    Users.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'User not found'
                })
            } else {
                const leave = new Leaves();
                leave._id = new mongoose.Types.ObjectId(),
                    leave.employeeId = employeeId;
                leave.description = req.body.description;
                leave.save()
                    .then(result => {
                        return res.status(201).json({
                            success: 'true',
                            message: 'Leave record added'
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
}

exports.getRecord = (req, res, next) => {
    const adminId = req.userId;
    Users.findById(adminId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'Admin not found'
                })
            } else {
                if (success.role == 'admin') {
                    Leaves.find({ status: 'pending' })
                        .then(result => {
                            if (result == null || result.length < 1) {
                                return res.status(200).json({
                                    success: 'true',
                                    message: 'No Leave request found!'
                                })
                            } else {
                                return res.status(200).json({
                                    success: 'true',
                                    message: 'Leave request found',
                                    Request: result
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
                        message: 'Unauthorized Access'
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

exports.editRecord = (req, res, next) => {
    const adminId = req.userId;
    const leaveId = req.params.leaveId;
    const status = req.body.status;
    Users.findById(adminId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'Admin not found'
                })
            } else {
                if (success.role == 'admin') {
                    Leaves.findById(leaveId)
                        .then(result => {
                            if (result == null || result.length < 1) {
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'Leave Record not found'
                                })
                            } else {
                                result.status = status;
                                result.save()
                                    .then(result1 => {
                                        return res.status(200).json({
                                            success: 'true',
                                            message: 'Record successfully updated'

                                        })
                                    })
                                    .catch(error => {
                                        return res.status(500).json({
                                            success: 'false',
                                            message: 'Some error occurred'
                                        })

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


exports.getMyRecord = (req, res, next) => {
    const userId = req.userId;
    const employeeId = req.employeeId;
    Users.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'User not found'
                })
            } else {

                Leaves.find({ employeeId: employeeId })
                    .then(result => {
                        if (result == null || result.length < 1) {
                            return res.status(200).json({
                                success: 'true',
                                message: 'No Leave record found!'
                            })
                        } else {
                            return res.status(200).json({
                                success: 'true',
                                message: 'Leave record found',
                                Record: result
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
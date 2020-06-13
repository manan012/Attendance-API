const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/user');
const Details = require('../models/editDetails');

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
                const detail = new Details();
                detail._id = new mongoose.Types.ObjectId(),
                    detail.employeeId = employeeId;
                if (req.body.name != null) {
                    detail.name = req.body.name;
                }
                if (req.body.role != null) {
                    detail.role = req.body.role;
                }
                if (req.body.email != null) {
                    detail.email = req.body.email;
                }
                if (req.body.phone != null) {
                    detail.phone = req.body.phone;
                }
                if (req.body.category != null) {
                    detail.category = req.body.category;
                }

                detail.save()
                    .then(result => {
                        return res.status(201).json({
                            success: 'true',
                            message: 'Edit Request sent'
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
                    Details.find({ status: 'pending' })
                        .then(result => {
                            if (result == null || result.length < 1) {
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'No Edit request found!'
                                })
                            } else {
                                return res.status(200).json({
                                    success: 'true',
                                    message: 'Edit request found',
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

exports.editDetails = (req, res, next) => {
    const adminId = req.userId;
    const detailId = req.params.detailId;
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
                    Details.findById(detailId)
                        .then(result => {
                            if (result == null || result.length < 1) {
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'Edit Record not found'
                                })
                            } else {
                                if (status === "approved") {
                                    Users.find({ employeeId: result.employeeId })
                                        .then(detail => {
                                            if (detail == null || detail[0].length < 1) {
                                                return res.status(404).json({
                                                    success: 'false',
                                                    message: 'User not found'
                                                })
                                            } else {
                                                if (req.body.name != null) {
                                                    detail[0].name = req.body.name;
                                                }
                                                if (req.body.role != null) {
                                                    detail[0].role = req.body.role;
                                                }
                                                if (req.body.email != null) {
                                                    detail[0].email = req.body.email;
                                                }
                                                if (req.body.phone != null) {
                                                    detail[0].phone = req.body.phone;
                                                }
                                                if (req.body.category != null) {
                                                    detail[0].category = req.body.category;
                                                }
                                                detail[0].save()
                                            }
                                        })

                                }

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
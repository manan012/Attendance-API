const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dot = require('dotenv').config();


exports.register = (req, res, next) => {
    const adminId = req.userId;
    Users.findById(adminId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(200).json({
                    success: 'false',
                    message: 'Admin not found'
                })
            } else {
                if (success.role == 'admin') {
                    Users.find({ email: req.body.email })
                        .exec()
                        .then(user => {
                            if (user.length >= 1) {
                                return res.status(200).json({
                                    success: 'false',
                                    message: 'Email Id already exists!'
                                })
                            } else {
                                bcrypt.hash(req.body.password, 10, (err, hash) => {
                                    if (err) {
                                        throw err;
                                    } else {
                                        const user = new Users({

                                            _id: new mongoose.Types.ObjectId(),
                                            name: req.body.name,
                                            email: req.body.email,
                                            phone: req.body.phone,
                                            employeeId: req.body.employeeId,
                                            category: req.body.category,
                                            role: req.body.role,
                                            password: hash
                                        });
                                        user.save()
                                            .then(result => {
                                                console.log(result);
                                                res.status(201).json({
                                                    success: "true",
                                                    message: "User successfully created"
                                                })
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                throw err;
                                            });
                                    }
                                })

                            }
                        })
                        .catch(err1 => {
                            console.log('error: ', err1);
                            throw err1;
                        })

                } else {
                    return res.status(200).json({
                        success: 'false',
                        message: 'Unauthorized Access'
                    })
                }
            }
        })
        .catch(error => {
            throw error;
        })


}

exports.deleteUser = (req, res, next) => {
    const adminId = req.userId;
    const employeeId = req.params.employeeId;
    Users.findById(adminId)
        .exec()
        .then(success => {
            if (success == null || success.length > 1) {
                return res.status(200).json({
                    success: 'false',
                    message: 'Admin not found'
                })
            } else {
                if (success.role == 'admin') {
                    Users.find({ employeeId: employeeId })
                        .then(success1 => {
                            if (success1 == null || success1.length < 1) {
                                return res.status(200).json({
                                    success: 'false',
                                    message: 'User not found'
                                })
                            } else {
                                Users.findByIdAndDelete(success1[0]._id)
                                    .then(result1 => {
                                        return res.status(200).json({
                                            success: 'true',
                                            message: 'User successfully deleted'
                                        })
                                    })
                                    .catch(error1 => {
                                        throw error1;
                                    })
                            }
                        })
                        .catch(error2 => {
                            throw error2;
                        })

                } else {
                    return res.status(200).json({
                        success: 'false',
                        message: 'Unauthorized access'
                    })
                }
            }
        })
        .catch(error3 => {
            throw error3;
        })
}


exports.login = (req, res, next) => {
    Users.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(200).json({
                    success: 'false',
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    throw err;
                }
                if (result) {
                    const token = jwt.sign({
                        employeeId: user[0].employeeId,
                        userId: user[0]._id
                    }, 'secretkey', {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        message: 'Auth Successful',
                        token: token
                    })
                }
                res.status(200).json({
                    success: 'false',
                    message: 'Auth failed'
                });
            })

        })
        .catch(err => {
            throw err;
        })
}


exports.editUser = (req, res, next) => {

    const adminId = req.userId;
    const employeeId = req.params.employeeId;
    Users.findById(adminId)
        .exec()
        .then(success => {
            if (success == null || success.length > 1) {
                return res.status(200).json({
                    success: 'false',
                    message: 'Admin not found'
                })
            } else {
                if (success.role == 'admin') {
                    Users.find({ employeeId: employeeId })
                        .then(success1 => {
                            if (success1 == null || success1.length < 1) {
                                return res.status(200).json({
                                    success: 'false',
                                    message: 'User not found'
                                })
                            } else {
                                if (req.body.name != null) {
                                    success1[0].name = req.body.name;
                                }
                                if (req.body.email != null) {
                                    success1[0].email = req.body.email;
                                }
                                if (req.body.employeeId != null) {
                                    success1[0].employeeId = req.body.employeeId;
                                }
                                if (req.body.phone != null) {
                                    success1[0].phone = req.body.phone;

                                }
                                if (req.body.category != null) {
                                    success1[0].category = req.body.category;
                                }
                                if (req.body.role != null) {
                                    success1[0].role = req.body.role;

                                }
                                success1[0].save()
                                    .then(result1 => {
                                        return res.status(200).json({
                                            success: 'true',
                                            message: 'User successfully updated'
                                        })
                                    })
                                    .catch(error1 => {
                                        console.log(error1);
                                        throw error1;
                                    })
                            }
                        })
                        .catch(error3 => {
                            console.log(error3);
                            throw error3;
                        })
                } else {
                    return res.status(200).json({
                        success: 'false',
                        message: 'Unauthorized access'
                    })
                }
            }
        })
        .catch(error4 => {
            throw error4;
        })

}

exports.reset = (req, res, next) => {
    const newPassword = req.body.newPassword;
    Users.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(200).json({
                    success: 'false',
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    throw err;
                }
                if (result) {
                    bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                        if (err1) {
                            throw err1;
                        } else {
                            user[0].password = hash;
                            user[0].save()
                                .then(resetSuccess => {
                                    return res.status(200).json({
                                        success: 'true',
                                        message: 'Password changed successfully'
                                    })
                                })
                                .catch(error12 => {
                                    throw error12;
                                })

                        }
                    })
                }
                res.status(200).json({
                    success: 'false',
                    message: 'Auth failed'
                });
            })

        })
        .catch(err12 => {
            throw error12;
        })
}

exports.getUser = (req, res, next) => {
    const userId = req.userId;
    Users.findById(userId)
        .then(success => {
            console.log(success);

            if (success == null || success.length < 1) {
                return res.status(200).json({
                    success: 'false',
                    message: 'User not found'
                })
            } else {
                return res.status(200).json({
                    success: 'true',
                    message: 'User found',
                    user: success
                })
            }
        })
        .catch(err => {
            console.log(err);

            throw err;
        })
}
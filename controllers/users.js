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
                return res.status(404).json({
                    success: 'false',
                    message: 'Admin not found'
                })
            } else {
                if (success.role == 'admin') {
                    Users.find({ email: req.body.email })
                        .exec()
                        .then(user => {
                            if (user.length >= 1) {
                                return res.status(409).json({
                                    message: 'Email Id already exists!'
                                })
                            } else {
                                bcrypt.hash(req.body.password, 10, (err, hash) => {
                                    if (err) {
                                        return res.status(500).json({
                                            error: err
                                        })
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
                                                return res.status(500).json({
                                                    error: err
                                                });
                                            });
                                    }
                                })
                            }
                        })
                        .catch(err => {
                            console.log('error: ', err);
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
        .catch(error => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
        })


}


exports.login = (req, res, next) => {
    Users.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, 'secretkey', {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        message: 'Auth Successful',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            })

        })
        .catch(err => console.log('error: ', err))
}
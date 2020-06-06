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
                res.status(404).json({
                    success: 'false',
                    message: 'Admin not found'
                })
                return 1;
            } else {
                if (success.role == 'admin') {
                    Users.find({ email: req.body.email })
                        .exec()
                        .then(user => {
                            if (user.length >= 1) {
                                res.status(403).json({
                                    success: 'false',
                                    message: 'Email Id already exists!'
                                })
                                return 1;
                            } else {
                                bcrypt.hash(req.body.password, 10, (err, hash) => {
                                    if (err) {
                                        res.status(500).json({
                                            success: 'false',
                                            message: 'Some error occurred'
                                        })
                                        return 1;
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
                                                return 1;
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                res.status(400).json({
                                                    success: "false",
                                                    message: "All fields are not set properly. Some error occurred"

                                                });
                                                return 1;
                                            });
                                    }
                                })
                            }
                        })
                        .catch(err => {
                            console.log('error: ', err);
                            res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred'
                            })
                            return 1;
                        })

                } else {
                    res.status(401).json({
                        success: 'false',
                        message: 'Unauthorized Access'
                    })
                    return 1;
                }
            }
        })
        .catch(error => {
            res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
            return 1;
        })


}

exports.deleteUser = (req, res, next) => {
    const adminId = req.userId;
    const userId = req.params.userId;
    Users.findById(adminId)
        .exec()
        .then(success => {
            if (success == null || success.length > 1) {
                res.status(404).json({
                    success: 'false',
                    message: 'Admin not found'
                })
                return 1;
            } else {
                if (success.role == 'admin') {
                    Users.findById(userId)
                        .then(success1 => {
                            if (success1 == null || success1.length < 1) {
                                res.status(404).json({
                                    success: 'false',
                                    message: 'User not found'
                                })
                                return 1;
                            } else {
                                console.log(success1);
                                Users.findByIdAndDelete(success1._id)
                                    .then(result1 => {
                                        res.status(200).json({
                                            success: 'true',
                                            message: 'User successfully deleted'
                                        })
                                        return 1;
                                    })
                                    .catch(error1 => {
                                        res.status(500).json({
                                            success: 'false',
                                            message: 'Some error occurred'
                                        })
                                        return 1;
                                    })
                            }
                        })
                        .catch(error2 => {
                            res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred'
                            })
                            return 1;
                        })

                } else {
                    res.status(401).json({
                        success: 'false',
                        message: 'Unauthorized access'
                    })
                    return 1;
                }
            }
        })
        .catch(error3 => {
            res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
            return 1;
        })
}


exports.login = (req, res, next) => {
    Users.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    success: 'false',
                    message: 'Auth failed'
                })
                return 1;
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    res.status(401).json({
                        success: 'false',
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        employeeId: user[0].employeeId,
                        userId: user[0]._id,
			role: user[0].role
                    }, 'secretkey', {
                        expiresIn: "1h"
                    });
                    res.status(200).json({
                        success: 'true',
                        message: 'Auth Successful',
                        token: token
                    })
                    return 1;
                }
                res.status(401).json({
                    success: 'false',
                    message: 'Auth failed'
                });
                return 1;
            })

        })
        .catch(err => {
            console.log('error: ', err);
            res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
            return 1;
        })
}


exports.editUser = (req, res, next) => {

    const adminId = req.userId;
    const employeeId = req.params.employeeId;
    const userId = req.params.userId;
    Users.findById(adminId)
        .exec()
        .then(success => {
            if (success == null || success.length < 1) {
                res.status(404).json({
                    success: 'false',
                    message: 'Admin not found'
                })
                return 1;
            } else {
                if (success.role == 'admin') {
                    Users.find({ employeeId: employeeId })
                        .then(success1 => {
                            console.log(success1[0]);
                            if (success1 == null || success1[0].length < 1) {
                                res.status(404).json({
                                    success: 'false',
                                    message: 'User not found'
                                })
                                return 1;
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
                                        res.status(200).json({
                                            success: 'true',
                                            message: 'User successfully updated'
                                        })
                                        return 1;
                                    })
                                    .catch(error1 => {
                                        console.log(error1);
                                        res.status(500).json({
                                            success: 'false',
                                            message: 'Some error occurred'
                                        })
                                        return 1;
                                    })
                            }
                        })
                        .catch(error2 => {
                            console.log(error2);

                            res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred'
                            })
                            return 1;
                        })
                } else {
                    res.status(401).json({
                        success: 'false',
                        message: 'Unauthorized access'
                    })
                    return 1;
                }
            }
        })
        .catch(error3 => {
            res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
            return 1;
        })

}

exports.reset = (req, res, next) => {
    const newPassword = req.body.newPassword;
    const password = req.body.password;
    Users.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(404).json({
                    success: 'false',
                    message: 'User not found'
                })

            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {


                if (err) {
                    return res.status(401).json({
                        success: 'false',
                        message: 'Auth failed'
                    });

                }
                if (result) {
                    bcrypt.hash(req.body.newPassword, 10, (error, hash) => {

                        if (error) {

                            return res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred'
                            })

                        } else {

                            user[0].password = hash;
                            user[0].save()
                                .then(resetSuccess => {
                                    //console.log('hiiiiiiiiiiiiiiiiiiiii');
                                    return res.status(200).json({
                                        success: 'true',
                                        message: 'Password changed successfully'
                                    })

                                })
                                .catch(error12 => {
                                    return res.status(500).json({
                                        success: 'false',
                                        message: 'Error in resetting the password'
                                    })

                                })

                        }
                    })
                } else {
                    return res.status(401).json({
                        success: 'false',
                        message: 'Auth failed'
                    });
                }

            })

        })
        .catch(err1 => {
            res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
            return 1;
        })
}

exports.getDetails = (req, res, next) => {
    const userId = req.userId;
    Users.findById(userId)
        .then(success => {
            console.log(success);

            if (success == null || success.length < 1) {
                res.status(404).json({
                    success: 'false',
                    message: 'User not found'
                })
                return 1;
            } else {
                res.status(200).json({
                    success: 'true',
                    message: 'User found',
                    user: success
                })
                return 1;
            }
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
            return 1;
        })
}


exports.getUser = (req, res, next) => {

    const adminId = req.userId;
    const userId = req.params.userId;
    Users.findById(adminId)
        .exec()
        .then(success => {
            if (success == null || success.length > 1) {
                res.status(404).json({
                    success: 'false',
                    message: 'Admin not found'
                })
                return 1;
            } else {
                if (success.role == 'admin') {
                    Users.findById(userId)
                        .then(success1 => {
                            if (success1 == null || success1.length < 1) {
                                res.status(404).json({
                                    success: 'false',
                                    message: 'User not found'
                                })
                                return 1;
                            } else {
                                return res.status(200).json({
                                    success: 'true',
                                    message: 'user found',
                                    user: success1
                                })
                            }
                        })
                        .catch(error2 => {
                            console.log(error2);

                            res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred'
                            })
                            return 1;
                        })
                } else {
                    res.status(401).json({
                        success: 'false',
                        message: 'Unauthorized access'
                    })
                    return 1;
                }
            }
        })
        .catch(error3 => {
            res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
            return 1;
        })
}


exports.getAllUser = (req, res, next) => {

    const adminId = req.userId;
    Users.findById(adminId)
        .exec()
        .then(success => {
            if (success == null || success.length > 1) {
                res.status(404).json({
                    success: 'false',
                    message: 'Admin not found'
                })
                return 1;
            } else {
                if (success.role == 'admin') {
                    Users.find()
                        .then(success1 => {
                            if (success1 == null || success1.length < 1) {
                                res.status(404).json({
                                    success: 'false',
                                    message: 'User not found'
                                })
                                return 1;
                            } else {
                                return res.status(200).json({
                                    success: 'true',
                                    message: 'user found',
                                    user: success1
                                })
                            }
                        })
                        .catch(error2 => {
                            console.log(error2);

                            res.status(500).json({
                                success: 'false',
                                message: 'Some error occurred'
                            })
                            return 1;
                        })
                } else {
                    res.status(401).json({
                        success: 'false',
                        message: 'Unauthorized access'
                    })
                    return 1;
                }
            }
        })
        .catch(error3 => {
            res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
            return 1;
        })

}

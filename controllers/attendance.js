const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/user');
const Attendance = require('../models/attendance');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dot = require('dotenv').config();


// exports.markAttendance = (req, res, next) => {
//     const id = req.params.userId;
//     //console.log(id);
//     Users.findById(id)
//         .exec()
//         .then(user => {


//             if (user.length < 1) {
//                 return res.status(404).json({
//                     message: "User Not found"
//                 })
//             } else {
//                 const name = user.name;
//                 const email = user.email;
//                 const attend = new Attendance({
//                     _id: new mongoose.Types.ObjectId(),
//                     present: "true",
//                     onLeave: "false",
//                     date: Date.now(),
//                     _user: user

//                 })
//                 attend
//                     .save()
//                     .then(result => {
//                         console.log(attend);
//                         res.status(200).json({
//                             message: "Attendance updated",

//                         })

//                     })
//                     .catch(err => {
//                         console.log(err);
//                         return res.status(500).json({
//                             error: err
//                         });
//                     });


//             }

//         })
//         .catch(err => console.log(err));

// }

exports.getAttendanceById = (req, res, next) => {
    const adminId = req.userId;
    const id = req.params.userId;
    let today1 = new Date().toDateString();
    const lte = (new Date('2020-05-20').toDateString());
    //console.log("Less than", lte);


    Users.findById(adminId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin Not found'
                })
            } else {
                if (success.role == 'admin') {
                    //console.log('yes', success.role);
                    Users.findById(id)
                        .then(myUser => {
                            if (myUser == null || myUser.length < 1) {
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'User Not found'
                                })
                            }
                            else {
                                Attendance.find({ _user: id })

                                    .then(result => {
                                        if (result == null || result.length < 1) {
                                            return res.status(404).json({
                                                success: false,
                                                message: 'Attendance Record of User Not found'
                                            })
                                        } else {
                                            return res.status(200).json({
                                                message: "success",
                                                AttendanceRecord: result
                                            })

                                        }
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        return res.status(500).json({
                                            success: "false",
                                            message: "Some Error occurred"
                                        })
                                    })
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({
                                success:'false',
                                message:'Error Occurred. Invalid User'
                            })

                        })

                } else {
                    return res.status(401).json({
                        success: "false",
                        message: "Unauthorized Access"
                    })
                }


            }
        })
        .catch(err => {
            return res.status(500).json({
                success: 'false',
                message: 'Some Error Occurred'
            })
        })



}



exports.markAttendance = (req, res, next) => {
    const id = req.userId;
    let today1 = new Date().toDateString();


    Users.findById(id)
        .exec()
        .then(result => {
            if (result == null || result.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: "User not exists",

                })

            }
            else {
                Users.findByIdAndUpdate({ _id: id }, { onLeave: false }, function (err1, success1) {
                    if (err1) {
                        console.log("error in user");
                    }
                    else {
                        console.log("Success in user");

                    }

                })
                Attendance.findOne({ _user: id, date: today1 })
                    .exec()
                    .then(success => {


                        if (success == null || success.length < 1) {
                            const attend = new Attendance();

                            attend._id = new mongoose.Types.ObjectId(),
                                attend.present = true,
                                attend.date = new Date().toDateString(),
                                attend._user = id;

                            attend.save()
                                .then(result => {
                                    var string = JSON.stringify(attend._user);
                                    var objectValue = JSON.parse(string);
                                    return res.status(200).json({
                                        success: "true",
                                        message: "Attendance marked successfully",

                                    })

                                })
                        } else {
                            //console.log("success ", success);
                            return res.status(403).json({
                                success: "false",
                                message: "Attendance already marked"
                            })
                        }

                    })



            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                success: "false",
                message: "Some error occurred"
            })
        });
}
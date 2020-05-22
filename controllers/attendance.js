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

// exports.getAttendance = (req,res,next) => {
//     const id = req.userId;
//     Users.findById(id)
//     .exec()
//         .then(result => {
//             if (result.length < 1) {
//                 return res.status(404).json({
//                     success:"false",
//                     message: "User not exists",

//                 })

//             }
//             else {
//                 result
//             }
//     })
//     .catch()
// }



exports.markAttendance = (req, res, next) => {
    const id = req.userId;

    Users.findById(id)
        .exec()
        .then(result => {
            if (result.length < 1) {
                return res.status(404).json({
                    success:"false",
                    message: "User not exists",

                })

            }
            else {
                Users.findByIdAndUpdate({_id:id},{onLeave:"false"},function (err1, success1) {
                    if(err1) {
                        console.log("error ");
                    }
                    else {
                        console.log("Success");
                        
                    }
                    
                })
                const today1 = new Date(new Date().toDateString());
                Attendance.findOneAndUpdate({ date: today1 })
                    .exec()
                    .then(success => {
                        if (success == null) {
                            const attend = new Attendance();

                            attend._id = new mongoose.Types.ObjectId(),
                                attend.present.push("true"),
                                attend.onLeave.push("false"),
                                attend.date = new Date(new Date().toDateString()),
                                attend._user.push(result);

                            attend.save()
                                .then(result => {
                                    var string = JSON.stringify(attend._user);
                                    var objectValue = JSON.parse(string);
                                    return res.status(200).json({
                                        success:"true",
                                        message: "Attendance marked successfully",
                                        
                                    })

                                })
                        } else {
                            console.log("success ", success);
                            Attendance.update({
                                date: today1
                            },
                                { $push: { present: "true", onLeave: "false", _user: result } },
                                function (error, succ) {
                                    if (error) {
                                        return res.status(500).json({
                                            success:"false",
                                            message:"Some error occurred"
                                        })
                                        //console.log("noo  ", error);

                                    }
                                    else {
                                        return res.status(200).json({
                                            success:"true",
                                            message:"Attendance marked successfully"
                                        })
                                    }
                                })
                        }

                    })



            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                success:"false",
                message:"Some error occurred"
            })
        });
}
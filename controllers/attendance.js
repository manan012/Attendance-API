const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/user');
const Attendance = require('../models/attendance');
const url = require('url');


exports.getAllAttendance = (req, res, next) => {
    const adminId = req.userId;

    const qwe = url.parse(req.url, true).query;
    var df = qwe.dateFrom;
    var dt = qwe.dateTo;
    //console.log(df);
    //console.log(new Date(2020, 7, 14));
    //console.log("Less than", lte);
    var arr1 = [];
    var arr2 = [];

    arr1 = df.split('-');
    arr2 = dt.split('-');
    //console.log(arr1[0], arr1[1], arr1[2]);
    //console.log(arr2[0], arr2[1], arr2[2]);

    var dateFrom = new Date();
    dateFrom.setFullYear(arr1[0], arr1[1] - 1, arr1[2]);
    dateFrom.setUTCHours(0);
    dateFrom.setUTCMinutes(0);
    dateFrom.setUTCSeconds(0);
    dateFrom.setUTCMilliseconds(0);
    //console.log('date from:', dateFrom);

    var dateTo = new Date();
    dateTo.setFullYear(arr2[0], arr2[1] - 1, arr2[2]);
    dateTo.setUTCHours(0);
    dateTo.setUTCMinutes(0);
    dateTo.setUTCSeconds(0);
    dateTo.setUTCMilliseconds(0);
    //console.log('date To:', dateTo);

    Users.findById(adminId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'Admin Not found'
                })
            } else {
                if (success.role == 'admin') {

                    Attendance.find({ date: { $gte: dateFrom, $lte: dateTo } })
                        .then(result => {
                            if (result == null || result.length < 1) {
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'No attendance record found'
                                })
                            } else {
                                return res.status(200).json({
                                    success: 'true',
                                    AttendenceRecord: result
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
                        message: 'unauthorized Access'
                    })
                }
            }
        })
        .catch(err => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
        })
}




exports.getAttendanceById = (req, res, next) => {
    const adminId = req.userId;
    const id = req.params.userId;

    const qwe = url.parse(req.url, true).query;
    var df = qwe.dateFrom;
    var dt = qwe.dateTo;
    //console.log(df);
    //console.log(new Date(2020, 7, 14));
    //console.log("Less than", lte);
    var arr1 = [];
    var arr2 = [];

    arr1 = df.split('-');
    arr2 = dt.split('-');
    //console.log(arr1[0], arr1[1], arr1[2]);
    //console.log(arr2[0], arr2[1], arr2[2]);

    var dateFrom = new Date();
    dateFrom.setFullYear(arr1[0], arr1[1] - 1, arr1[2]);
    dateFrom.setUTCHours(0);
    dateFrom.setUTCMinutes(0);
    dateFrom.setUTCSeconds(0);
    dateFrom.setUTCMilliseconds(0);
    //console.log('date from:', dateFrom);

    var dateTo = new Date();
    dateTo.setFullYear(arr2[0], arr2[1] - 1, arr2[2]);
    dateTo.setUTCHours(0);
    dateTo.setUTCMinutes(0);
    dateTo.setUTCSeconds(0);
    dateTo.setUTCMilliseconds(0);
    //console.log('date To:', dateTo);

    Users.findById(adminId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'Admin Not found'
                })
            } else {
                if (success.role == 'admin') {
                    //console.log('yes', success.role);
                    Users.find({employeeId: id})
                        .then(myUser => {
                            if (myUser == null || myUser.length < 1) {
                                return res.status(404).json({
                                    success: 'false',
                                    message: 'User Not found'
                                })
                            } else {
                                Attendance.find({ _user: id, date: { $gte: dateFrom, $lte: dateTo } })

                                .then(result => {
                                        if (result == null || result.length < 1) {
                                            return res.status(404).json({
                                                success: 'false',
                                                message: 'Attendance Record of User Not found'
                                            })
                                        } else {
                                            return res.status(200).json({
                                                success: 'true',
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
                                success: 'false',
                                message: 'Error Occurred. Invalid User'
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
    const employeeId = req.employeeId;
	
    var d = new Date();
    var a = d.getFullYear();
    var b = d.getMonth();
    var c = d.getDate();
    //console.log(a, b, c);
    d.set
    d.setFullYear(a, b, c);
    d.setUTCHours(0);
    d.setUTCMinutes(0);
    d.setUTCSeconds(0);
    d.setUTCMilliseconds(0);
    //console.log('find date:', d);
    var qw = d.getTime();
    var d1 = new Date(qw);
    //console.log('find mS', qw);

    let today1 = String(new Date(new Date().toDateString()));
    //console.log('today1: ', today1);


    var x1 = new Date();
    var x2 = x1.getTime();
    var x3 = new Date(x2);
    //var x2 = x1.getMilliseconds();
    //console.log('date', x3);
    //console.log(x3.toString("YYYY MMM DD"));

    //console.log('date2', x2);
    Users.findById(id)
        .exec()
        .then(result => {
            if (result == null || result.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: "User not exists",

                })

            } else {
                // Users.findByIdAndUpdate({ _id: id }, { onLeave: false }, function (err1, success1) {
                //     if (err1) {
                //         console.log("error in user");
                //     }
                //     else {
                //         console.log("Success in user");

                //     }

                // })
                Attendance.findOne({ _user: employeeId, date: { $gte: qw } })
                    .exec()
                    .then(success => {
                        if (success == null || success.length < 1) {
                            const attend = new Attendance();

                            attend._id = new mongoose.Types.ObjectId(),
                                attend.present = true,
                                attend.date = x2,
                                attend._user = employeeId;

                            attend.save()
                                .then(result => {
                                    var string = JSON.stringify(attend._user);
                                    var objectValue = JSON.parse(string);
                                    return res.status(200).json({
                                        success: "true",
                                        message: "Attendance marked successfully",

                                    })

                                })
                                .catch(err => {
                                    console.log(err);

                                    return res.status(500).json({
                                        success: 'false',
                                        message: 'Some error Occurred'
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

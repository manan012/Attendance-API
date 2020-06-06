const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/user');
const Tasks = require('../models/task');
const Modules = require('../models/modules');
const Projects = require('../models/project');

exports.createProject = (req, res, next) => {
    // const userId = req.params.userId;
    const userId = req.userId;

    Users.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'User Not found'
                })
            } else {

                const project = new Projects();
                project._id = new mongoose.Types.ObjectId(),
                project.name = req.body.name;
                project.createdBy = userId;
                if (req.body.module != null) {
                    project._modules = req.body.module;
                }

                if (req.body.member != null) {
                    project._members = req.body.member;
                }

                project.save()
                    .then(result => {
                        console.log(result);
                        return res.status(201).json({
                            success: "true",
                            message: "Project successfully created",
                            ProjctId: result._id
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).json({
                            success: "false",
                            message: "Some error Occurred"
                        });
                    });
            }
        })
        .catch(error => {
            console.log(error)
            return res.status(500).json({
                success: "false",
                message: "Some error occurred"
            })
        })

}

exports.editProject = (req, res, next) => {

    const userId = req.userId;
    const projectId = req.params.projectId;
    // const title = req.body.title;
    // const desc = req.body.description;

    Users.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'User Not found'
                })
            } else {

                Projects.find({ _id: projectId, createdBy: userId })
                    .then(result => {
			console.log(result);
                        if (result == null || result.length < 1) {
                            return res.status(404).json({
                                success: 'false',
                                message: 'Project not found'
                            })
                        } else {

                            if (req.body.name != null) {
                                result[0].name = req.body.name;
                            }
                            if (req.body.module != null) {
                                result[0]._modules = req.body.module;
                            }
                            if (req.body.member != null) {
                                result[0]._members = req.body.member;
                            }

                            result[0].save()
                                .then(result1 => {
                                    return res.status(200).json({
                                        success: 'true',
                                        message: 'Project successfully updated'
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
			console.log(err);
                        return res.status(500).json({
                            success: 'false',
                            message: 'Some error occurred'
                        })
                    })
            }
        })
        .catch(err11 => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error occurred'
            })
        })
}

exports.deleteProject = (req, res, next) => {

    const userId = req.userId;
    const projectId = req.params.projectId;

    Users.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'User Not found'
                })
            } else {

                Projects.find({ _id: projectId, createdBy: userId })
                    .then(result => {
                        if (result == null || result.length < 1) {
                            return res.status(404).json({
                                success: 'false',
                                message: 'Project not found'
                            })
                        } else {
                            Projects.findByIdAndDelete(projectId)
                                .then(result1 => {
                                    return res.status(200).json({
                                        success: 'true',
                                        message: 'Project successfully deleted'
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
            }
        })
        .catch(err => {
            return res.status(500).json({
                success: 'false',
                message: 'Some error has occurred'
            })
        })
}


exports.getAllProject = (req, res, next) => {

    const userId = req.userId;
    const employeeId = req.employeeId;
    Users.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'User Not found'
                })
            } else {
                Projects.find({ _members: employeeId })
                    .then(result => {
                        if (result == null || result.length < 1) {
                            return res.status(404).json({
                                success: 'false',
                                message: 'Project not found'
                            })
                        } else {
                            return res.status(200).json({
                                success: 'true',
                                message: 'Projects Found',
                                project: result
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


exports.getProject = (req, res, next) => {
    const userId = req.userId;
    const employeeId = req.employeeId;
    const projectId = req.params.projectId
    Users.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'User Not found'
                })
            } else {
                Projects.find({ _members: employeeId, _id: projectId })
                    .then(result => {
                        if (result == null || result.length < 1) {
                            return res.status(404).json({
                                success: 'false',
                                message: 'Project not found'
                            })
                        } else {
                            return res.status(200).json({
                                success: 'true',
                                message: 'Projects Found',
                                project: result
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

exports.getModules = (req, res, next) => {
    const userId = req.userId;
    const employeeId = req.employeeId;
    const projectId = req.params.projectId;
    Users.findById(userId)
        .then(success => {
            if (success == null || success.length < 1) {
                return res.status(404).json({
                    success: "false",
                    message: 'User Not found'
                })
            } else {
                Projects.find({ _members: employeeId, _id: projectId }, { _modules: true })
                    .then(result => {
                        if (result == null || result.length < 1) {
                            return res.status(404).json({
                                success: 'false',
                                message: 'Project not found'
                            })
                        } else {
                            return res.status(200).json({
                                success: 'true',
                                message: 'Project Found',
                                modules: result
                            })

                        }
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

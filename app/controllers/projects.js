'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    PMembers = mongoose.model('ProjectMembers'),
    User = mongoose.model('User'),
    async = require('async'),
    _ = require('lodash'),
    PStorage = mongoose.model('ProjectStorage'),
    path = require('path'),
    fs = require('fs'),
    formidable = require('formidable'),
    join = path.join,
    dir = path.join(__dirname + '../../../public/uploads');

/**
 * Create a project
 */
exports.create = function(req, res) {
    var project = new Project(req.body);
    project.user = req.user.id;

    project.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                project: project
            });
        } else {
            var adminMember = new PMembers({
                project: project._id,
                user: req.user.id,
                type: 1
            });

            adminMember.save(function(err){
                if(err) console.log('Error creating the admin user: '+ err);
                else res.jsonp(project);
            });
        }
    });
};

/**
 * Show the current project
 */
exports.open = function(req, res) {
    PMembers.find({project: req.project._id}).exec(function(err, members){
        User.findOne({ _id:req.project.user }).exec(function(err, data) {
            if(err) console.log(err);
            else {
                var users = [];
                var project = {
                    _id: req.project._id,
                    user: data,
                    created: req.project.created,
                    files: req.project.files,
                    users: req.project.users,
                    content: req.project.content,
                    title: req.project.title
                };

                async.each(members, function(member, callback) {
                    User.findOne({ _id: member.user }).exec(function(err, data) {
                        if (data !== null) {
                            users.push({
                                displayName: data.displayName,
                                id: data._id
                            });
                        }
                        callback();
                    });
                }, function(err) {
                    if(err) console.log(err);
                    else {
                        project.members = users;
                        res.jsonp(project);
                    }
                });
            }
        });
    });
};

/**
 * Update a project
 */
exports.update = function(req, res) {
    var project = req.project;

    project = _.extend(project, req.body);

    project.save(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(project);
        }
    });
};

/**
 * Delete an project
 */
exports.delete = function(req, res) {
    var project = req.project;

    project.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            PMembers.remove({project: project._id}).exec();
            res.jsonp(project);
        }
    });
};

/**
 * List of Projects
 */
exports.list = function(req, res) {
//    Project.remove({}).exec();
//    PMembers.remove({}).exec();

    PMembers.find({user: req.user._id}).exec(function(err, data){
        var projects = [];
        async.each(data, function(data, callback) {
            Project.findOne({ _id: data.project }).exec(function(err, data) {
                if (data !== null) {
                    projects.push(data);
                }
                callback();
            });
        }, function(err) {
            if(err) console.log(err);
            else {
                res.jsonp(projects);
            }
        });
    });
};

/**
 * Add Member to Project
 */
exports.addMember = function(req, res) {
    PMembers.create({project: req.body.id, user: req.body.user, type: 2}, function(err){
        if(err) console.log(err);
        else {
            Project.findOne({ _id: req.body.id}, function (err, project) {
                if(err) console.log(err);
                project.users += 1;
                project.save(getMembers());
            });
        }
    });

    function getMembers(){
        PMembers.find({project: req.body.id}).exec(function(err, data) {
            var users = [];
            async.each(data, function(data, callback) {
                User.findOne({ _id: data.user }).exec(function(err, data) {
                    if (data !== null) {
                        users.push({
                            displayName: data.displayName,
                            id: data._id
                        });
                    }
                    callback();
                });
            }, function(err) {
                if(err) console.log(err);
                else {
                    res.jsonp(users);
                }
            });
        });
    }
};

/**
 * Delete Member from Project
 */
exports.deleteMember = function(req, res) {
    PMembers.remove({project: req.body.id, user: req.body.user}, function(err){
        if(err) console.log(err);
        else {
            Project.findOne({ _id: req.body.id}, function (err, project) {
                if(err) console.log(err);
                project.users -= 1;
                project.save(getMembers());
            });
        }
    });

    function getMembers(){
        PMembers.find({project: req.body.id}).exec(function(err, data) {
            var users = [];
            async.each(data, function(data, callback) {
                User.findOne({ _id: data.user }).exec(function(err, data) {
                    if (data !== null) {
                        users.push({
                            displayName: data.displayName,
                            id: data._id
                        });
                    }
                    callback();
                });
            }, function(err) {
                if(err) console.log(err);
                else {
                    res.jsonp(users);
                }
            });
        });
    }
};


/**
 * List of Storage Files
 */
exports.storageList = function(req, res) {
    if(req.params.id){
        PStorage.find({project: req.project._id, inFolder: req.params.id}).sort('type').exec(function(err, files){
            if (err) {
                console.log(err);
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(files);
            }
        });
    } else {
        PStorage.find({project: req.project._id, inFolder: '0'}).sort('type').exec(function(err, files) {
            if (err) {
                console.log(err);
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(files);
            }
        });
    }
};

/**
 * Create Storage folder
 */
exports.storageCreate = function(req, res){
    var folder = new PStorage(req.body);
    console.log(req.body);
    folder.save(function(err){
        if (err) {
            console.log(err);
            return res.send('users/signup', {
                errors: err.errors,
                file: folder
            });
        } else {
            res.jsonp(folder);
        }
    });
};


/**
 * Remove file or Folder
 */

exports.storageRemove = function(req, res){
    PStorage.remove({_id: req.params.id}).exec();
};

/**
 * Upload a file on the file system
 */

/*jshint loopfunc: true*/

exports.storageUploadFile = function(req, res){
    var form = new formidable.IncomingForm();
    var callbackFiles = [];
    var inFolder = '0';
    var file,name,tArr,rName,path,newPath;

    form
        .on('field', function(field, value) {
            inFolder = value;
        })
        .on('file', function(field, file) {
            name = file.name;
            tArr = name.split('.');
            rName = Math.floor((Math.random() * 99999999) + 1) + '_' + Math.floor((Math.random() * 99999999) + 1) + '.' + tArr[1];
            path = join(dir, file.name);
            newPath = join(dir, rName);
            fs.rename(file.path, path, function(err){
                if (err) console.log('Error uploading file the error is: ' + err);
                fs.rename(path, newPath, function(err){
                    var fileDBInfo = {
                        name: file.name,
                        realName: rName,
                        fileType: file.type,
                        size: file.size,
                        inFolder: inFolder,
                        project: req.params.projectId,
                        user: req.user,
                        type: 2
                    };

                    var fileDB = new PStorage(fileDBInfo);
                    fileDB.save(function(err) {
                        if (err) {
                            console.log('Error saving file in the DB: ' + err);
                        } else {
                            callbackFiles.push(fileDBInfo);
                        }
                    });

                });
            });
        })
        .on('end', function(){
            res.writeHead(res.statusCode.toString(), {'content-type': 'text/plain'});
            res.write(JSON.stringify(callbackFiles));
            res.end();
        });

    form.parse(req);
};

/**
 * Projects middleware
 */
exports.projectByID = function(req, res, next, id) {
    Project.findById(id).exec(function(err, project) {
        if (err) return next(err);
        if (!project) return next(new Error('Failed to load project ' + id));
        req.project = project;
        next();
    });
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.project.user !== req.user.id) {
        return res.send(403, 'User is not authorized');
    }
    next();
};
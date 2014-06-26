'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Storage = mongoose.model('Storage'),
    PStorage = mongoose.model('ProjectStorage'),
    _ = require('lodash'),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs'),
    fse = require('fs-extra'),
    formidable = require('formidable'),
    join = path.join,
    dir = path.join(__dirname + '../../../public/uploads');


/**
 * Create a folder
 */
exports.create = function(req, res){
    var folder = new Storage(req.body);
    folder.user = req.user;

    folder.save(function(err) {
        if (err) {
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
 * Upload a file on the file system
 */

/*jshint loopfunc: true*/

exports.uploadFile = function(req, res){
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
                        user: req.user,
                        type: 2
                    };
                    var fileDB = new Storage(fileDBInfo);
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

exports.uploadCloudFile = function(req, res){
    console.log(req.body);
    Storage.findOne({ _id: req.body.file }).exec(function(err, data){
        if(err) console.log('Error finding the file from DB: ' + err);
        else {
            var name = data.name;
            var tArr = name.split('.');
            var rName = Math.floor((Math.random() * 99999999) + 1) + '_' + Math.floor((Math.random() * 99999999) + 1) + '.' + tArr[1];
            var file = {
                name: data.name,
                realName: rName,
                fileType: data.fileType,
                size: data.size,
                inFolder: req.body.folder,
                user: req.user,
                project: req.body.id,
                type: 2
            };
            var path = join(dir, data.realName);
            var newPath = join(dir, rName);
            fse.copy(path, newPath, function(err){
                if (err) console.log('Error uploading file the error is: ' + err);
                var fileDB = new PStorage(file);
                fileDB.save(function(err) {
                    if (err) {
                        console.log('Error saving file in the DB: ' + err);
                    } else {
                        res.writeHead(res.statusCode.toString(), {'content-type': 'text/plain'});
                        res.write(JSON.stringify(file));
                        res.end();
                    }
                });
            });
        }
    });
};


/**
 * Remove file or Folder
 */

exports.remove = function(req, res){
    Storage.remove({_id: req.params.id}).exec();
};

exports.download = function(req, res){
    Storage.findOne({ _id: req.params.id }).exec(function(err, data){
        if(err) console.log('Error finding the file from DB: ' + err);
        else {
            console.log(data);
            var filePath = join(dir, data.realName);

            res.download(filePath, data.name);
            // var filename = path.basename(file);
            // var mimetype = mime.lookup(file);

            // res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            // res.setHeader('Content-type', mimetype);

            // var filestream = fs.createReadStream(file);
            // filestream.pipe(res);
        }
    });
};

/**
 * List of Storage Files
 */
exports.list = function(req, res) {
    if(req.params.id){
        Storage.find({user: req.user.id, inFolder: req.params.id}).sort('type').exec(function(err, files){
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(files);
            }
        });
    } else {
        Storage.find({user: req.user.id, inFolder: '0'}).sort('type').exec(function (err, files) {
            if (err) {
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
 * Storage middleware
 */
exports.fileByID = function(req, res, next, id) {
    Storage.findById(id).populate('user', 'displayName').exec(function(err, file) {
        if (err) return next(err);
        if (!file) return next(new Error('Failed to load file ' + id));
        req.file = file;
        next();
    });
};

/**
 * Storage authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.file.user.id !== req.user.id) {
        return res.send(403, 'User is not authorized');
    }
    next();
};
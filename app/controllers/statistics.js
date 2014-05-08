'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Statistics = mongoose.model('Statistics'),
    Storage = mongoose.model('Storage'),
    _ = require('lodash');

/**
 * Get user statistics
 */
exports.get = function(req, res) {
    Statistics.findOne({user: req.user.id}).exec(function (err, statistics){
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            if(statistics === null){
                var seed = new Statistics({ user: req.user.id });
                seed.save(function(err){
                    if(err) console.log('Failed to get user Statistics: ' + err);
                    else {
                        var tmp = [{
                            user: req.user.id,
                            files: 0,
                            folders: 0,
                            storage: 0,
                            projects: 0
                        }];
                        res.jsonp(tmp);
                    }
                });
            } else {
                var cb = [statistics];
                res.jsonp(cb);
            }
        }
    });
};

/**
 * Update user statistics
 */

exports.update = function(req, res) {

    function updateDB(obj){
        Statistics.update({ user: req.user.id }, {
            files: obj.files,
            folders: obj.folders,
            storage: obj.storage
        }, function(statistics){
            res.jsonp([statistics]);
        });
    }

    Storage.find({user: req.user.id}).exec(function (err, files){
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            var obj = {
                files: 0,
                folders: 0,
                storage: 0
            };
            var file;

            for(var i = 0; i < files.length; i++){
                file = files[i];
                if (file.type === 1) {
                    obj.folders += 1;
                } else {
                    obj.files += 1;
                    obj.storage += parseInt(file.size);
                }
                if(i === files.length - 1) updateDB(obj);
            }
        }
    });
};

/**
 * Statistics authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.file.user.id !== req.user.id) {
        return res.send(403, 'User is not authorized');
    }
    next();
};
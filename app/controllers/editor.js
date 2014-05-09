'use strict';

var mongoose = require('mongoose'),
    Storage = mongoose.model('Storage'),
    PStorage = mongoose.model('ProjectStorage');

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
    res.end();
};

exports.openFile = function(req, res) {
    Storage.findOne({ _id: req.params.fileId}).exec(function(err, file){
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(file);
        }
    });
};
'use strict';

var mongoose = require('mongoose'),
    Storage = mongoose.model('Storage'),
    PStorage = mongoose.model('ProjectStorage'),
    fs = require('fs'),
    path = require('path'),
    sync = require('sync'),
    // fabric = require('fabric').fabric,
    join = path.join,
    dir = path.join(__dirname + '../../../public/uploads');

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

exports.openFileProject = function(req, res) {
    PStorage.findOne({ _id: req.params.fileId }).exec(function(err, file){
        if (err) {
            console.log(err);
            res.render('error', {
                status: 500
            });
        } else {
            console.log(file);
            res.jsonp(file);
        }
    });
};

// exports.saveFileCloud = function(req, res){
//     if(req.body.type === 1){
//         PStorage.findById(req.params.fileId).exec(function(err, file){
//             if (err) {
//                 res.render('error', {
//                     status: 500
//                 });
//             } else {
//                 var out = fs.createWriteStream(join(dir, 'temp.png'));
//                 var canvas = fabric.createCanvasForNode(req.body.width, req.body.height);

//                 canvas.loadFromJSON(JSON.parse(req.body.canvasObj), function() {
//                     //canvas.renderAll();

//                     var stream = canvas.createPNGStream();
//                     stream.on('data', function(chunk) {
//                         out.write(chunk);
//                         console.log('saved chunk');
//                     });
//                     stream.on('end', function(chunk) {
//                         out.end(chunk);
//                         console.log('pic saved');
//                     });
//                 });
//             }
//         });
//     }
// };
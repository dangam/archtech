'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MessengerSchema = new Schema({
    content: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: String,
        ref: 'User'
    },
    userId: {
        type: Schema.ObjectId,
        ref: 'UserId'
    },
    file: {
        type: Schema.ObjectId,
        ref: 'File'
    },
    type: {
        type: Number
    }
});

var Messenger = mongoose.model('Messenger', MessengerSchema);
    
exports.saveMessage = function(data) {
	var message = new Messenger(data);

    message.save(function(err) {
        if (err) {
            console.log('Error while saving message!');
            console.log(err);
        } else {
            console.log('Message saved!');
        }
    });
};

exports.getMessages = function(req, res){
    Messenger.find({ file: req.params.id }).exec(function (err, msgs){
        if(err) console.log(err);
        else {
            res.jsonp(msgs);
            console.log(msgs);
        }
    });
};
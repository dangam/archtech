'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Project Storage Schema
 */
var PStorageSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true,
        required: 'Не може да бъде празно'
    },
    realName: {
        type: String,
        default: ''
    },
    fileType: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: ''
    },
    inFolder: {
        type: String,
        default: ''
    },
    created: {
        type: Date,
        default: Date.now
    },
    project: {
        type: Schema.ObjectId,
        ref: 'Project'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    type: Number,
    active: {
        type: Number,
        default: 1
    }
});

mongoose.model('ProjectStorage', PStorageSchema);
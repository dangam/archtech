'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Storage Schema
 */
var StorageSchema = new Schema({
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

mongoose.model('Storage', StorageSchema);
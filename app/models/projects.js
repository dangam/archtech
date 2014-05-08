'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Името не може да бъде празно'
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    users: {
        type: Number,
        default: 1
    },
    files: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Project', ProjectSchema);
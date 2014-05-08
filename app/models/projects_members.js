'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Project Members Schema
 */
var PMembersSchema = new Schema({
    project: {
        type: Schema.ObjectId,
        ref: 'Project'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    type: {
        type: Number
    }
});

mongoose.model('ProjectMembers', PMembersSchema);
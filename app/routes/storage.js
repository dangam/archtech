'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    storage = require('../../app/controllers/storage');

module.exports = function(app) {
    // Storage Routes
    app.get('/storage', users.requiresLogin, storage.list);
    app.get('/storage/:id', users.requiresLogin, storage.list);
    app.post('/storage', users.requiresLogin, storage.create);
    app.post('/storage/server-upload-file', users.requiresLogin, storage.uploadFile);
    app.post('/storage/upload-file-cloud', users.requiresLogin, storage.uploadCloudFile);
    app.post('/storage/remove/:id', users.requiresLogin, storage.remove);

    // Finish by binding the storage middleware
    app.param('storageId', storage.fileByID);
};
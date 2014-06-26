'use strict';

/**
 * Module dependencies.
 */
var editor = require('../../app/controllers/editor');

module.exports = function(app) {

    // Editor Routes
    app.get('/editor', editor.index);
    app.get('/editor/file/:fileId', editor.openFile);
    app.get('/editor/project/file/:fileId', editor.openFileProject);

    app.post('/editor/save/file/:fileId', editor.saveFileCloud);

};
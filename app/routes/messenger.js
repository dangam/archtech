'use strict';

/**
 * Module dependencies.
 */
var editor = require('../../app/controllers/messenger');

module.exports = function(app) {

    // Editor Routes
    app.get('/messenger/get/:id', editor.getMessages);

};
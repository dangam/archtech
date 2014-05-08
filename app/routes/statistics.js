'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    statistics = require('../../app/controllers/statistics');

module.exports = function(app) {
    // Storage Routes
    app.get('/statistics', users.requiresLogin, statistics.get);
    app.get('/statistics/update', users.requiresLogin, statistics.update);
};
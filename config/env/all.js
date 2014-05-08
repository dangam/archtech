'use strict';

var path = require('path'),
	rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	app: {
		title: 'ArchTech',
		description: 'Online Image Editor',
		keywords: 'ArchTech'
	},
	root: rootPath,
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'ArchTech_MEAN',
	sessionCollection: 'sessions'
};
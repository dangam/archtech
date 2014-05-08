'use strict';

module.exports = {
	db: 'mongodb://localhost/archtechv2-travis',
	port: 3001,
	app: {
		title: 'ArchTech - Travis Environment'
	},
	facebook: {
        clientID: '246951615491530',
        clientSecret: '207017395649a00738f7b2afb43d725e',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: 'CONSUMER_KEY',
		clientSecret: 'CONSUMER_SECRET',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	google: {
		clientID: 'APP_ID',
		clientSecret: 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	linkedin: {
		clientID: 'APP_ID',
		clientSecret: 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/linkedin/callback'
	}
};
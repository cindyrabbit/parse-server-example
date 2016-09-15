var appRoot = require('app-root-path'),
	dev = require('./dev.js'),
	util = require('util'),
	utils = require(appRoot + '/controllers/utilities/utils.js' );

var serverUrl = process.env.SERVER_URL || 'http://lvhunba-parse-eastasia.azurewebsites.net'; 
var databaseUri = process.env.DATABASE_URI || 'mongodb://chris:870807@lvhunba-mongdb.eastasia.cloudapp.azure.com:27017/dogfood';

var dogfood = {
	server: {
		serverURL: serverUrl,
		publicServerURL: serverUrl + '/parse',
		databaseURI: databaseUri
	}
};

// Deep extend dev with dogfood config.
utils.extendDeep(dev, dogfood);
module.exports = dev;
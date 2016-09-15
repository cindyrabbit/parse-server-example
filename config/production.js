var appRoot = require('app-root-path'),
	dev = require('./dev.js'),
	util = require('util'),
	utils = require(appRoot + '/controllers/utilities/utils.js' );

var serverUrl = process.env.SERVER_URL || 'https://lvhunba-parse-eastasia.azurewebsites.net'; 
var databaseUri = process.env.DATABASE_URI || 'mongodb://chris:870807@lvhunba-mongdb.eastasia.cloudapp.azure.com:27017/production';

var production = {
	server: {
		serverURL: serverUrl,
		publicServerURL: serverUrl + '/parse',
		databaseURI: databaseUri
	},
	dashboard:{
	    apps: [
	      {
	        serverURL: serverUrl + '/parse',
	        appId: 'myAppId',
          	masterKey: 'myMasterKey',
          	appName: 'Lvhunba Parse Server'
	      }
	    ]
	}
};

// Deep extend dev with dogfood config.
utils.extendDeep(dev, production);

module.exports = dev;
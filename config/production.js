var appRoot = require('app-root-path'),
	dev = require('./dev.js'),
	util = require('util'),
	utils = require(appRoot + '/controllers/utilities/utils.js' );

var serverUrl = process.env.SERVER_URL || 'https://lvhunba-parse-eastasia.azurewebsites.net/parse';
var databaseUri = process.env.DATABASE_URI || 'mongodb://nextbride:JhHpRwiVFeXb3ecFLaeDKveokw3TcEga9kto69gwp3aFtnwMLqxZaky9iapbDcONQol0V1znx2V3RYtiI6HLNg==@nextbride.documents.azure.com:10250/prod?ssl=true';

var production = {
	server: {
		serverURL: serverUrl,
		publicServerURL: serverUrl,
		databaseURI: databaseUri
	},
	dashboard:{
	    apps: [
	      {
	        serverURL: serverUrl,
	        appId: 'myAppId',
          	masterKey: 'myMasterKey',
          	appName: 'Lvhunba Parse Server'
	      }
	    ]
	},
	storage:
	{
		name: 'lvhunba',
		container: 'pic-public',
		accessKey: 'vT1ENNWXv8hKXwcWlSlKG45620k5a/J1MjGJr5JtWq8bAsfZyI4S09dhHjzzYZen8co/duAc/3ndvHrSUzyyqw==',
		directAccess: true
	}
};

// Remove fileAdapter overwritting from dev and use default settings in parse-server-azure-config
delete dev.server['filesAdapter'];

// Deep extend dev with dogfood config.
utils.extendDeep(dev, production);

module.exports = dev;
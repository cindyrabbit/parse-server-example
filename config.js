var cloud = process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js';
console.log(util.format("Cloud: %s", cloud ));

var appId = process.env.APP_ID || 'myAppId';
console.log(util.format("APP_ID: %s", appId ));

var masterKey = process.env.MASTER_KEY || 'myMasterKey'; //Add your master key here. Keep it secret!
console.log(util.format("MASTER_KEY: %s", masterKey ));

var serverUrl = process.env.SERVER_URL || 'http://localhost:1337/parse';  // Don't forget to change to https if needed
console.log(util.format("SERVER_URL: %s", serverUrl ));

var javascriptKey = process.env.JAVASCRIPT_KEY || 'myJavascriptKey';
console.log(util.format("JAVASCRIPT_KEY: %s", javascriptKey ));

module.exports = {
  server: {
  	  databaseURI: databaseUri,
  appId: appId,
  masterKey: masterKey, 
  serverURL: serverUrl,
    cloud: cloud,
  javascriptKey: javascriptKey,
  appName: 'parse-server-example',
  publicServerURL: 'http://parse-server-example5889.azurewebsites.net/parse',
       allowClientClassCreation: false,
     enableAnonymousUsers: false,

  verifyUserEmails: true,
	  emailAdapter: {
	    module: 'parse-server-mandrill-adapter',
	    options: {
	      // API key from Mandrill account
	      apiKey: '3my2mDn3BN6Lhr_-aaH0jA',
	      // From email address
	      fromEmail: 'contactus@fotonic.co',
	      // Reply-to email address
	      replyTo: 'contactus@fotonic.co',
	      // Display name
	      displayName: 'contactus@fotonic.co',
	      // Verification email subject
	      verificationSubject: 'Please verify your e-mail for *|appname|*',
	      // Verification email body
	      verificationBody: 'Hi,\n\nYou are being asked to confirm the e-mail address *|email|* with *|appname|*\n\nClick here to confirm it:\n*|link|*',
	      // Password reset email subject
	      passwordResetSubject: 'Password Reset Request for *|appname|*',
	      // Password reset email body
	      passwordResetBody: 'Hi,\n\nYou requested a password reset for *|appname|*.\n\nClick here to reset it:\n*|link|*'
	    }
	  },
	  liveQuery: {
	    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
	  }
  },
  dashboard: {},
  storage: {},
  push: {}
}
// serverUrl should not contain surfix like /parse
// Don't forget to change to https if needed
var serverUrl = process.env.SERVER_URL || 'http://localhost:1337'; 

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey
var javascriptKey = process.env.JAVASCRIPT_KEY || 'myJavascriptKey';

//appId, masterKey, databaseURI, serverURI, cloud and logFolder are defined in parse-server-azure-config package reading from machine Environment or default value. 
module.exports = {
  server: {
  javascriptKey: javascriptKey,
  appName: 'lvhunba-parse-server',
  publicServerURL: serverUrl + '/parse',
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
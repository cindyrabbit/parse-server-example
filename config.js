var fs = require('fs');
var appRoot = require('app-root-path');

// serverUrl should not contain surfix like /parse
// Don't forget to change to https if needed
var serverUrl = process.env.SERVER_URL || 'http://localhost:1337'; 

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey
var javascriptKey = process.env.JAVASCRIPT_KEY || 'myJavascriptKey';
var emailDir = appRoot + '/views/emailTemplates';
console.log("emailDir is " + emailDir);
var verificationBody = fs.readFileSync(emailDir + '/confirmEmail.ejs', 'utf8');
var passwordResetBody = fs.readFileSync(emailDir + '/resetPassword.ejs', 'utf8');

// console.log(verificationBody);

//appId, masterKey, databaseURI, serverURI, cloud and logFolder are defined in parse-server-azure-config package reading from machine Environment or default value. 

module.exports = {
  server: {
	  javascriptKey: javascriptKey,
	  appName: '旅婚吧',
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
	      displayName: '旅婚吧',
	      company: 'Nextstop Inc',
	      link_website: 'http://www.lvhunba.com',
	      link_emai: 'contactus@fotonic.co',
	      link_wechat: '',
	      link_weibo: '',
	      icon_weibo: 'http://127.0.0.1:1338/images/outline_color_weibo_48.png',
	      icon_wechat: 'http://127.0.0.1:1338/images/outline_color_wechat_48.png',
	      // Verification email subject
	      verificationSubject: '*|appname|* - 请确认您的邮箱',
	      // Verification email body
	      // verificationBody: fs.readFileSync(emailDir + '/confirmEmail.ejs', 'utf8'),
	       //verificationBody: 'Hi,\n\nYou are being asked to confirm the e-mail address *|email|* with *|appname|*\n\nClick here to confirm it:\n*|link|*',
	       verificationBody: verificationBody,
	      // Password reset email subject
	      passwordResetSubject: '*|appname|* - 密码重置',
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
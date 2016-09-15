var appRoot = require('app-root-path');
var utils = require('./utils.js');
var main = require(appRoot + '/index.js');
var config = require( appRoot + main.configSettings[process.env.NODE_ENV]);
var mandrill = require('mandrill-api/mandrill');
var fs = require('fs');
var moment = require('moment');
var extend = require('xtend');

var mandrill_client = new mandrill.Mandrill(config.server.emailAdapter.options.apiKey);
var emailDir = appRoot + '/views/emailTemplates';
var basic_options = {
	'appname': config.server.appName,
	'company': config.server.emailAdapter.options.company,
	'from_email': config.server.emailAdapter.options.fromEmail,
	'from_name': config.server.emailAdapter.options.displayName,
	'link_website': config.server.emailAdapter.options.link_website,
	'link_email': config.server.emailAdapter.options.link_email,
	'link_wechat': config.server.emailAdapter.options.link_wechat,
	'link_weibo': config.server.emailAdapter.options.link_weibo,
	'icon_wechat': config.server.emailAdapter.options.icon_wechat,
	'icon_weibo': config.server.emailAdapter.options.icon_weibo
};

function sendWelcomeEmail(params){
	utils.logDebug("sendWelcomeEmail", "Entering with email %s username %s", params.email, params.username);
  	var promise = new Parse.Promise();

  	var filename = emailDir + '/welcome.ejs';
		fs.readFile( filename, 'utf8', (err, data) => {
			if(err){
				utils.logError("sendWelcomeEmail", "Read file err: %j", err);
				return promise.reject("Failed reading file " + filename);
			}

			var options = {
				'email': params.email,
				'message': data,
				'subject': "*|appname|* - 欢迎加入旅婚吧",
				'to':{ 
					'email': params.email,
					'name': params.username
				},
				'tags': ['welcome']
			};

			// Merge options with basics. The rightmost parameter takes precedence
          	options = extend(basic_options, options);

			scheduleEmail(options).then( 
				result => {
					promise.resolve(result);
				}, 
				error => {
					promise.reject(error);
				});
		});

	return promise;
}

function sendEmailConfirmation(params){
	utils.logDebug("sendEmailConfirmation", "Entering with email %s username %s", params.email, params.username);
  	var promise = new Parse.Promise();

  	var filename = emailDir + '/confirmEmail.ejs';
		fs.readFile( filename, 'utf8', (err, data) => {
			if(err){
				utils.logError("sendEmailConfirmation", "Read file err: %j", err);
				return promise.reject("Failed reading file " + filename);
			}

			var options = {
				'email': params.email,
				'message': data,
				'subject': "*|appname|* - 请确认您的邮箱",
				'to':{ 
					'email': params.email,
					'name': params.username
				},
				'tags': ['emailconfirmation']
			};

			// Merge options with basics. The rightmost parameter takes precedence
          	options = extend(basic_options, options);

			scheduleEmail(options).then( 
				result => {
					promise.resolve(result);
				}, 
				error => {
					promise.reject(error);
				});
		});

	return promise;
}

function scheduleEmail(options){

	utils.logDebug("scheduleEmail", "Entering ...");

	if(!utils.isValidEmail(options.email))
	{
		utils.logError("scheduleEmail", "Email '%s' is not valid. ", options.email);
		return Parse.Promise.error("Email address is not valid");
	}

	var promise = new Parse.Promise();

	var message = {
    "html": options.message,
    // "text": "Example text content",
    "subject": options.subject,
    "from_email": options.from_email,
    "from_name": options.from_name,
    "to": [{
            "email": options.to.email,
            "name": options.to.name,
            "type": "to"
        }],
    "headers": {
        "Reply-To": options.from_email
    },
    "important": false,
    "track_opens": true,
    "track_clicks": true,
    "auto_text": true,
    "auto_html": true,
    "inline_css": null,
    "url_strip_qs": null,
    "preserve_recipients": null,
    "view_content_link": null,
    // "bcc_address": "message.bcc_address@example.com",
    "tracking_domain": null,
    "signing_domain": null,
    "return_path_domain": null,
    "merge": true,
    "merge_language": "mailchimp",
    "global_merge_vars": [
	    	{ "name": "CURRENT_YEAR", "content": "2016"},
	    	{ "name": "COMPANY", "content": options.company},
	    	{ "name": "appname", "content": options.appname},
	    	{ "name": "link_website", "content": options.link_website},
	    	{ "name": "link_email", "content": options.link_email},
	    	{ "name": "link_weibo", "content": options.link_weibo},
	    	{ "name": "link_wechat", "content": options.link_wechat},
	    	{ "name": "icon_weibo", "content": options.icon_weibo},
	    	{ "name": "icon_wechat", "content": options.icon_wechat}
    	],
    "merge_vars": [{
            "rcpt": options.to.email,
            "vars": [
            		{ "name": "username", "content": options.to.name},
            		{ "name": "subject", "content": options.subject}
            	]
        }],
    "tags":	options.tags,
    // "subaccount": "customer-123",
    // "google_analytics_domains": [
    //     "example.com"
    // ],
    // "google_analytics_campaign": "message.from_email@example.com",
    "metadata": {
        "website": options.link_website
    },
    // "recipient_metadata": [{
    //         "rcpt": "recipient.email@example.com",
    //         "values": {
    //             "user_id": 123456
    //         }
    //     }],
    // "attachments": [{
    //         "type": "text/plain",
    //         "name": "myfile.txt",
    //         "content": "ZXhhbXBsZSBmaWxl"
    //     }],
    // "images": [{
    //         "type": "image/png",
    //         "name": "IMAGECID",
    //         "content": "ZXhhbXBsZSBmaWxl"
    //     }]
};
var async = false;
var ip_pool = "Main Pool";
var send_at =  moment().format("YYYY-MM-DD HH:mm:ss");
utils.logDebug("scheduleEmail", "Ready to send message, send_at: %s", send_at);

mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {

	utils.logDebug("scheduleEmail", "Mandrill message send result: %j", result);
    /*
    [{
            "email": "recipient.email@example.com",
            "status": "sent",
            "reject_reason": "hard-bounce",
            "_id": "abc123abc123abc123abc123abc123"
        }]
    */

	if(result[0].status != 'invalid')
	{
		var successMsg = "Mandrill message sent. status: " + result[0].status + ", reject_reason: " + result[0].reject_reason;
		utils.logDebug(successMsg);
		promise.resolve(successMsg);
	}
	else
	{
		var errorMsg = 'Mandrill request status invalid, please check request parameters.';
		utils.logError(errorMsg);
		promise.reject(errorMsg);
	}

}, function(e) {
    // Mandrill returns the error as an object with name and message keys
    var errorMsg = 'A mandrill error occurred: ' + e.name + ' - ' + e.message;
	utils.logError("scheduleEmail", "Mandrill message send result: %s", errorMsg);
    // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    promise.reject(errorMsg);

});

	return promise;
}

module.exports= {
	sendWelcomeEmail: sendWelcomeEmail,
	sendEmailConfirmation: sendEmailConfirmation
};

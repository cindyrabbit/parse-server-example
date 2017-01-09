var emailHandler = require(__dirname + '/../controllers/utilities/emailHandler.js');
var appRoot = require('app-root-path');
var utils = require(appRoot + '/controllers/utilities/utils.js');
var util = require('util');
var ParseUser = Parse.Object.extend("User");
var moment = require('moment');

/*********************
curl -X POST   \
-H "X-Parse-Application-Id: myAppId"   \
-H "Content-Type: application/json"   \
-d '{}'   \
http://127.0.0.1:1338/parse/functions/hello
**********************/
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hello from Azure.');
});

Parse.Cloud.define('sendBookEmail', function(req,res){

	// Check request integrity before proceed
	if(!req.params.photographer || !req.params.name || (!req.params.phone && !req.params.wechat) )
	{
		return;
	}

	// Check allowed parameters here
	var options = {
		"to": {
            "email": '3129125775@txt.att.net',
            "type": "to"
        },
        "from_email": 'hi@fotonic.co',
		'subject': 'Booking',
		'text': util.format("%s booked %s at %s. Wechat: %s, phone: %s", req.params.name, req.params.photographer, moment().format("MM-DD HH:mm:ss"), req.params.wechat, req.params.phone)
	}

	emailHandler.scheduleEmail(options).then(function(result){
  		res.success(result);
	}, function(err){
		res.error(err);
	});
});

Parse.Cloud.define('sendWelcomeEmail', function(req,res){

	if(!req.params.email)
	{
		res.error('Target email is not defined');
	}

	// Check allowed parameters here
	var options = {
		'email': req.params.email,
		'username': req.params.username
	}

	emailHandler.sendWelcomeEmail(options).then(function(result){
  		res.success(result);
	}, function(err){
		res.error(err);
	});
});


Parse.Cloud.define('sendEmailConfirmation', function(req,res){

	if(!req.params.email)
	{
		res.error('Target email is not defined');
	}

	// Check allowed parameters here
	var options = {
		'email': req.params.email,
		'username': req.params.username
	}

	emailHandler.sendEmailConfirmation(options).then(function(result){
  		res.success(result);
	}, function(err){
		res.error(err);
	});
});

Parse.Cloud.beforeSave(Parse.User, function(request, response){

	var user = request.object;

	// Make sure customUrl for each photographer is unique
	if(user.get("photographer") && user.get('photographer').customUrl)
	{
		var query = new Parse.Query(ParseUser);
		query.equalTo("photographer.customUrl", user.get('photographer').customUrl);

		query.first().then(function(result){
			if(result && result.id != user.id){
				return response.error({ code: 137, message: "CustomUrl already exists"});
			}
			else
			{
				return response.success();
			}
		}, function(error){
			return response.error("Failed to query customUrl from all photographers.");
		});
	}
	else
	{
		return response.success();
	}
});
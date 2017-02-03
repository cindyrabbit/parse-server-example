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

	// Exit if phone number is not a valid China's number and wechat is not present
	var phone_number = req.params.phone;
	var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
    var isPhone = /^(?:(?:0\d{2,3})-)?(?:\d{7,8})(-(?:\d{3,}))?$/;

    if( !(phone_number.match(isMobile) || phone_number.match(isPhone)) && !req.params.wechat)
    {
    	return res.error("Invalid input.");
    }

	// Check allowed parameters here
	var options = {
		"to": [{
            "email": '3129125775@txt.att.net',
            "type": "to"
        },{
            "email": 'lvhunba@foxmail.com',
            "type": "to"
        }],
        "from_email": 'hi@fotonic.co',
		'subject': 'Booking',
		'text': util.format("%s booked at %s. Wechat: %s, phone: %s, message: %s", req.params.name, moment().format("MM-DD HH:mm:ss"), req.params.wechat, req.params.phone, req.params.message)
	}

	emailHandler.scheduleEmail(options).then(function(result){
  		return res.success(result);
	}, function(err){
		return res.error(err);
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
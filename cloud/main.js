var emailHandler = require(__dirname + '/../controllers/utilities/emailHandler.js');
var appRoot = require('app-root-path');
var utils = require(appRoot + '/controllers/utilities/utils.js');

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
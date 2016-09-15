var express = require('express');
var path = require('path');
var util = require('util');
var moment = require('moment');
var url = require('url');

var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var parseServerConfig = require('parse-server-azure-config');

const configSettings = {
  'dev': '/config/dev.js',
  'dogfood': '/config/dogfood.js',
  'production': '/config/production.js'
};

process.env.NODE_ENV = 'dev';

console.log(util.format("process.env.WEBSITE_SITE_NAME is %s", process.env.WEBSITE_SITE_NAME));

// Determine environment by checking Website_site_name which is a default setting on Azure web app
if(process.env.WEBSITE_SITE_NAME == 'lvhunba-parse-dogfood')
{
  process.env.NODE_ENV = "dogfood";
}
else if(process.env.WEBSITE_SITE_NAME == 'lvhunba-parse-eastasia')
{
  process.env.NODE_ENV = "production"; // default value is 'dev'
}

module.exports = {
  'configSettings': configSettings
};

var config = parseServerConfig(__dirname, { 'config': configSettings[process.env.NODE_ENV] } );
console.log("config file location is " + configSettings[process.env.NODE_ENV]);

// Global variables need to be defined before app initialization to be ready for other modules
// global.appRoot = __dirname; 

var app = express();
app.use('/parse', new ParseServer(config.server));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/parse-dashboard', ParseDashboard(config.dashboard, true));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname+'/public/assets/'));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



// Middle-ware to print out request. This can be turn by export VERBOSE=true
// app.use(function(req, res, next) {
  
//   console.log(util.format('REQUEST - %s', moment().format("YYYY-MM-DD HH:mm:ss")));
//   console.log(util.format('%s: %s', req.method, req.originalUrl));
//   console.log(util.format('Headers: %j', req.headers));
//   console.log(util.format('Body: %j', req.body));

//   next();
// });

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('Make sure to star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

// Test pages in Lab environment
if(process.env.NODE_ENV != "production")
{
  app.get('/email/view/confirmemail', function(req,res){ res.render('emailTemplates/confirmEmail'); });
  app.get('/email/view/welcome', function(req,res){ res.render('emailTemplates/welcome')});
}

app.listen( process.env.PORT || url.parse(config.server.serverURL).port, function () {
  console.log(`Parse Server running at ${config.server.serverURL}`);
});

// This will enable the Live Query real-time server
// ParseServer.createLiveQueryServer(httpServer);

var express = require('express');
var path = require('path');
var util = require('util');
var moment = require('moment');
var url = require('url');

var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var parseServerConfig = require('parse-server-azure-config');
var config = parseServerConfig(__dirname);

var app = express();
app.use('/parse', new ParseServer(config.server));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/parse-dashboard', ParseDashboard(config.dashboard, true));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Middle-ware to print out request
app.use(function(req, res, next) {
  
  console.log(util.format('REQUEST - %s', moment().format("YYYY-MM-DD HH:mm:ss")));
  console.log(util.format('%s: %s', req.method, req.originalUrl));
  console.log(util.format('Headers: %j', req.headers));
  console.log(util.format('Body: %j', req.body));

  next();
});

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('Make sure to star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;

app.listen( port || url.parse(config.server.serverURL).port, function () {
  console.log(`Parse Server running at ${config.server.serverURL}`);
});

// This will enable the Live Query real-time server
// ParseServer.createLiveQueryServer(httpServer);




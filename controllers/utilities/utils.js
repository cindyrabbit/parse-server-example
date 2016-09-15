var util = require('util'),
    _ = require('lodash');

function isValidEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

// %s - method name
// %s - message
var LOG_DEBUG_FORMAT = "[%s]: %s"; // e.g. [MethodName] Message
var LOG_ERROR_FORMAT = "**** Error in [%s]: %s"; // e.g. **** Error in [MethodName]: Message

function logDebug(){

  var methodname = arguments[0];
  var messageArgs = Array.prototype.slice.call(arguments, 1);
  var messageStr = util.format.apply(util, messageArgs);

  console.log(util.format(LOG_DEBUG_FORMAT, methodname, messageStr));
}

function logError(){

  var methodname = arguments[0];
  var messageArgs = Array.prototype.slice.call(arguments, 1);
  var messageStr = util.format.apply(util, messageArgs);

  console.log(util.format(LOG_ERROR_FORMAT, methodname, messageStr));
}

// _.extend customizer function to deep traverse config object
var deep = function (dest, src){
    return _.isObject(dest) && _.isObject(src) ? _.extendWith(dest, src, deep) : src;
}

var extendDeep = function(dest, src){
  _.extendWith(dest, src, deep);
}

module.exports= {
	isValidEmail: isValidEmail,
	logDebug: logDebug,
	logError: logError,
  extendDeep: extendDeep
};
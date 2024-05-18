var log4js = require('log4js');
var config = require('../config');
const logLevel = config.log_level || 'info';

module.exports.getLoggerByName = function(name){
	log4js.configure({
		appenders: {
		  everything: { type: "stdout", layout: { type: 'pattern',  pattern: '[%d] [%p] - %c - %f{1}:%l:%o -  %m%n'} },
		},
		categories: {
		  default: { appenders: ["everything"], level: logLevel, enableCallStack : true },
		},
	  });
    const logger = log4js.getLogger(name);
    return logger;
}

module.exports.getLogger = function(){
    return module.exports.getLoggerByName('CRAWL');
}

module.exports.getLog = function(){
    return module.exports.getLoggerByName('Execution Engine');
}

module.exports.getLogForDB = function(){
    return module.exports.getLoggerByName('DataBase Calls');
}

module.exports.getLogForLib = function(){
    return module.exports.getLoggerByName('Library function');
}
module.exports.getScoreLogger = function(){
    return module.exports.getLoggerByName('SCORE CALCULATION');
}
module.exports.getUtilLogger = function(){
	return module.exports.getLoggerByName('Util function');
}
module.exports.getLeaderboardLogger = function(){
	return module.exports.getLoggerByName('Leaderboard function');
}
module.exports.getMentorLogger = function(){
	return module.exports.getLoggerByName('Mentor Library')
}
module.exports.getJobLogger = function(){
	return module.exports.getLoggerByName('JOB')
}

module.exports.getContestLeaderboard = function () {
  return module.exports.getLoggerByName("CONTEST LEADERBOARD");
};
var schedule = require('node-schedule');
var baidu = require('./baidu.js');
var config = require('./key.js');


//*
var j = schedule.scheduleJob(config.schedule, function(){
  baidu.push();
  baidu.checkSite();
});
//*/

console.log('baidu pusher running...');

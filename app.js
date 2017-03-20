'use strict';

var schedule  = require('node-schedule');
var data      = require('./lib/data-download.js');
var wardubot  = require('./lib/wardubot.js');

var dataUpdateSchedule        = new schedule.RecurrenceRule();
dataUpdateSchedule.dayOfWeek  = [1,4];
dataUpdateSchedule.hour       = 8;
dataUpdateSchedule.minute     = 20;

var launchingMessagesSchedule       = new schedule.RecurrenceRule();
launchingMessagesSchedule.dayOfWeek = [1,2,3,4,5,6,7];
launchingMessagesSchedule.hour      = 10;
launchingMessagesSchedule.minute    = 20;

console.log('application initialized. Scheduled jobs will start at specific time. Please do not close the app!');
schedule.scheduleJob(dataUpdateSchedule, function () {
  data.updateForSlack();
});



schedule.scheduleJob(launchingMessagesSchedule, function () {
  wardubot.sendMessages();
});

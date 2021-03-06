'use strict';

var schedule  = require('node-schedule');
var data      = require('./lib/data-download.js');
var wardubot  = require('./lib/wardubot.js');

var dataUpdateSchedule        = new schedule.RecurrenceRule();
dataUpdateSchedule.dayOfWeek  = [1,4];
dataUpdateSchedule.hour       = 6;
dataUpdateSchedule.minute     = 20;

var launchingMessagesSchedule       = new schedule.RecurrenceRule();
launchingMessagesSchedule.dayOfWeek = [1,2,3,4,5,6,7];
launchingMessagesSchedule.hour      = 7;
launchingMessagesSchedule.minute    = 40;

//when it starts it needs to get images to start working.
data.updateForSlack();

console.log('application initialized. Scheduled jobs will start at specific time. Please do not close the app!');
schedule.scheduleJob(dataUpdateSchedule, function () {
  data.updateForSlack();
});

schedule.scheduleJob(launchingMessagesSchedule, function () {
  wardubot.sendMessages();
});

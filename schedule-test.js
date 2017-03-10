'use strict';

var counter = 0,
    schedule = require('node-schedule'),
    taskSchedule = new schedule.RecurrenceRule();

taskSchedule.minute = 15;

function reportOnSchdeule () {
    //increment the counter
    counter++;

    //report that the scheduled task ran
    console.log('The scheduled task ran. This is iteration #: ' + counter);
}

schedule.scheduleJob(taskSchedule, reportOnSchdeule);

console.log('The schdule has been initialzed');

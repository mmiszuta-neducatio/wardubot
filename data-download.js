/*jslint node: true */
"use strict";

var async     = require("async");
var reqHelper = require("./modules/asyncRequestHelper.js");
var fs = require("fs");
var cloudinary = require('cloudinary');
var slackbot = require('slackbots');
var sortMethod = require('./lib/naturalCompare.js');
var schedule = require('node-schedule');




var start = function(productForSlack){
  var bot = new slackbot({
    token: 'xoxb-147510149990-kFvZ9AIbGVQ9xFM4EtK4zZa0',
    name : 'Wardubot'
  });
  bot.on('start', function(){
    console.log('started bot');
    var params = {
      icon_emoji: ':cat:'
    };

    for(var i=0 ;i<4; i++){
      bot.postMessageToChannel('general', productForSlack[i].imgUrl + "\n" + productForSlack[i].productLink, params);
    }

  });
  //urlLinksArray.splice(0,4);
}

// var rule = new schedule.RecurrenceRule();
// rule.minute = 26;

console.log('initializing schedule');

//schedule.scheduleJob(rule, function(){
  console.log('schedule initialized');
  async.waterfall([function(cb){
    console.log('waterfall 1');
    //preparationRequest callback returns array of links to promotions on biedronka.pl
    reqHelper.preparationRequest(cb);
  },
  function(promoLinks, cb){
    console.log('waterfall 2');
    //mainRequest callback returns array of links to every discounted product on biedronka.pl
    reqHelper.mainRequest(promoLinks[0], cb);
  },
  function(productForSlack, cb){
      start(productForSlack);
  }]);
//});

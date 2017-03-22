'use strict';

var Slackbot  = require('slackbots');
var fs        = require('fs');

module.exports = {
  sendMessages: function () {
    var i   = 0;
    var bot = new Slackbot({
      token: process.env.SLACKBOT_TOKEN,
      name: 'Wardubot'
    });
    bot.on('start', function () {
      console.log('starting bot...');
      console.log('getting data');
      var JSONFile = fs.readFileSync('./data.json', 'utf-8');
      var productsJSON = JSON.parse(JSONFile);
      console.log('updated data');
      var params = {
        unfurl_links: true
      };
      setImmediate(function () {
        bot.postMessageToChannel('random', 'Witam. Przedstawiam kilka produktów aktualnej promocji sklepu Biedronka', params);
      });
      setTimeout(function () {
        for (i = 0; i < 4; i++) {
          bot.postMessageToChannel('random', productsJSON[i].imgUrl + '\n' + productsJSON[i].productLink, params);
        }
      }, 500);

      for (i = 0; i < 4; i++) {
        productsJSON.shift();
      }
      fs.writeFileSync('./data.json', JSON.stringify(productsJSON, null, 2), 'utf-8');
    });
    bot.on('message', function(data) {
      if(data.type     === 'message' &&
         data.text     === 'Witam.'  &&
         data.username !== 'Wardubot') {
        var JSONFile = fs.readFileSync('./data.json', 'utf-8');
        var productsJSON = JSON.parse(JSONFile);
        var randomInt = Math.floor(Math.random() * productsJSON.length - 2);
        setImmediate(function () {
          bot.postMessage(data.channel, 'Witam.');
        });
        setTimeout(function () {
          bot.postMessage(data.channel, productsJSON[randomInt].imgUrl + '\n ' + productsJSON[randomInt].productLink, {unfurl_links: true});
        }, 100);
      }
    });
  },
  tellIfSomethingWentWrong: function (errorMessage) {
    var bot = new Slackbot({
      token: process.env.SLACKBOT_TOKEN,
      name: 'Wardubot'
    });
    bot.postMessageToChannel('random', errorMessage);
  }
};

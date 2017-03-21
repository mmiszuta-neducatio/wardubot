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
      var params = {
        icon_emoji: ':cat:',
        unfurl_links: true
      };
      bot.postMessageToChannel('random', 'Witam. Przedstawiam kilka produktów aktualnej promocji sklepu Biedronka', params);
      var JSONFile = fs.readFileSync('./data.json', 'utf-8');
      var productsJSON = JSON.parse(JSONFile);
      console.log('updated data');
      for (i = 0; i < 4; i++) {
        bot.postMessageToChannel('random', productsJSON[i].imgUrl + '\n' + productsJSON[i].productLink, params);
      }

      for (i = 0; i < 4; i++) {
        productsJSON.shift();
      }
      fs.writeFileSync('./data.json', JSON.stringify(productsJSON, null, 2), 'utf-8');
    });
  },
  tellIfSomethingWentWrong: function (errorMessage) {
    var bot = new Slackbot({
      token: process.env.SLACKBOT_TOKEN,
      name: 'Wardubot'
    });
    var params = {
      icon_emoji: ':cat:'
    };
    bot.postMessageToChannel('random', errorMessage, params);
  }
};

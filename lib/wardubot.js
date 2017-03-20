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
      var productsJSON = require('../data.json');
      console.log('updated data');
      var params = {
        icon_emoji: ':cat:',
        unfurl_links: true
      };

      for (i = 0; i < 4; i++) {
        bot.postMessageToChannel('random', productsJSON[i].imgUrl + '\n' + productsJSON[i].productLink, params);
      }

      for (i = 0; i < 4; i++) {
        productsJSON.shift();
      }
      fs.writeFileSync('./data.json', JSON.stringify(productsJSON, null, 2), 'utf-8');
    });
  }
};

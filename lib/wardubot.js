/*jslint node: true */
"use strict";

var slackbot = require("slackbots");
var fs       = require("fs");

module.exports = {
  sendMessages: function(){
    var bot = new slackbot({
      token: '',
      name : 'Wardubot'
    });
    bot.on('start', function(){
      console.log('starting bot...');
      console.log('getting data');
      var productsJSON = require('../data.json');
      console.log('updated data');
      var params = {
        icon_emoji: ':cat:',
        unfurl_links: true
      };

      for(var i=0 ;i<4; i++){
        bot.postMessageToChannel('random', productsJSON[i].imgUrl + "\n" + productsJSON[i].productLink, params);
      }

      for(var i = 0; i < 4; i++){
        productsJSON.shift();
      }

      fs.writeFileSync('./data.json', JSON.stringify(productsJSON, null,2),'utf-8');
    });
  }
};

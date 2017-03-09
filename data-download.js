/*jslint node: true */
"use strict";

var async     = require("async");
var reqHelper = require("./modules/asyncRequestHelper.js");
var fs = require("fs");
var cloudinary = require('cloudinary');
var slackbot = require('slackbots');

var getMyUrls = function(path, filenames, myUrl){

}

var cloudUpload = function(callback){
  cloudinary.config({
    cloud_name: 'doj3kuv7g',
    api_key   : '873865247332359',
    api_secret: 'fradOYWi4QmE8hDV9CP1yzgbj_M'
  });
  var path = './images/imagesWithPrice/';
  var allImages = fs.readdirSync(path);
  allImages.sort(naturalCompare);
  var urlsForSlack = [];
  for (var i = 0; i < 4; i++) {
    cloudinary.uploader.upload(path + allImages[i], function(res){
       urlsForSlack.push(res.url);
       callback(null, urlsForSlack);
     });
  }

}
var start = function(urlLinksArray, imageLinksArray){
  var bot = new slackbot({
    token: 'xoxb-147510149990-sYrycOgprS0XFpGbUaXbxocv',
    name : 'Wardubot'
  });
  bot.on('start', function(){
    var params = {
      icon_emoji: ':cat:'
    };
    for(var i=0 ;i<4; i++){
      bot.postMessageToChannel('general', imageLinksArray[i], params);
      bot.postMessageToChannel('general', urlLinksArray[i], params);
    }
  });
  //console.log(imageLinksArray);
  //deleteUploadedLinks(urlLinksArray);
}
var deleteUploadedLinks = function(productsUrls){
  console.log(productsUrls);
  productsUrls.splice(0,4);
  console.log(productsUrls);
  };

  var naturalCompare = function(a, b) {
    var ax = [], bx = [];

        a.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]);});
        b.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]);});

        while(ax.length && bx.length) {
                  var an = ax.shift();
                  var bn = bx.shift();
                  var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                  if(nn) {return nn;}
              }

        return ax.length - bx.length;
  };


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
function(productsLinks, cb){
  console.log('waterfall 3');
  //zawrzeć tutaj funkcję, która będzie zawierać: wrzucenie na hosting, usunięcie wrzuconych, wysłanie linków obrazków na slacka,
  //wysłanie linków do produktów pod obrazkami na slacka, usunięcie wrzuconych linków do produktów z arraya
  cloudUpload(productsLinks, cb);
  start(productsLinks, imagesLinks);
},
function(){

}]);

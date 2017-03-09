/*jslint node: true */
"use strict";

var async     = require("async");
var reqHelper = require("./modules/asyncRequestHelper.js");
var fs = require("fs");
var cloudinary = require('cloudinary');
var slackbot = require('slackbots');
var sortMethod = require('./lib/naturalCompare.js');
var getMyUrls = function(path, filenames, myUrl){

}

var cloudUpload = function(productsLinks, callback){
  cloudinary.config({
    cloud_name: 'doj3kuv7g',
    api_key   : '873865247332359',
    api_secret: 'fradOYWi4QmE8hDV9CP1yzgbj_M'
  });
  var path = './images/imagesWithPrice/';
  var allImages = fs.readdirSync(path);
  allImages.sort(sortMethod.naturalCompare);
  var imagesToUpload = allImages.slice(0, 4);
  var urlsForSlack = [];
  async.eachSeries(imagesToUpload, function(image, cb){
    cloudinary.uploader.upload(path + image, function(res){
       urlsForSlack.push(res.url);
       cb();
     });
  }, function(){
    callback(null, productsLinks, urlsForSlack);
  });
}

var start = function(urlLinksArray, imageLinksArray){
  var bot = new slackbot({
    token: 'xoxb-147510149990-sYrycOgprS0XFpGbUaXbxocv',
    name : 'Wardubot'
  });
  bot.on('start', function(){
    console.log('started bot');
    var params = {
      icon_emoji: ':cat:'
    };
    for(var i=0 ;i<4; i++){
      bot.postMessageToChannel('general', imageLinksArray[i] + "\n" + urlLinksArray[i], params);
      // setTimeout(function(){
      //   bot.postMessageToChannel('general', urlLinksArray[i], params)
      // }, 100);
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
},
function(productsLinks, imagesForSlack, cb){
    start(productsLinks, imagesForSlack);
}]);

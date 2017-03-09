/*jslint node: true */
"use strict";

var fs = require("fs");
var cloudinary = require('cloudinary');
var slackbot = require('slackbots');

cloudinary.config({
  cloud_name: 'doj3kuv7g',
  api_key: '873865247332359',
  api_secret: 'fradOYWi4QmE8hDV9CP1yzgbj_M'
});

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


var removeOldImages = function(){
  var path = './images/';
  var filesToRemove = fs.readdirSync(path);
  filesToRemove.sort(naturalCompare);
  console.log(filesToRemove);
  filesToRemove.forEach(function(filename){
    fs.unlinkSync(path + filename);
  });
};
//removeOldImages();

var cloudUpload = function(){
  var path = './ready/';
  var allImages = fs.readdirSync(path);
  allImages.sort(naturalCompare);
  for (var i = 0; i < 4; i++ )
  cloudinary.uploader.upload(path + allImages[i], function(res){
  console.log(res.url);
  });
}
 cloudUpload();

var removeUploadedFiles = function(){
  var path = './ready/';
  var allImages = fs.readdirSync(path);
  allImages.sort(naturalCompare);
  var uploadedFiles = allImages.slice(0,4);
  uploadedFiles.forEach(function(filename){
    fs.unlinkSync(path + filename);
  });
}
//removeUploadedFiles();
var bot = new slackbot({
  token: 'xoxb-147510149990-4eWVk2f0dafCDlwTDSVBZDkH',
  name: 'Wardubot'
});

bot.on('start', function(){
  var params = {
    author_icon: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAfqAAAAJGM4ZTQyMzU0LTM5YTktNDFhZi1hMGJhLWNiYTkyYjBlMzRjZg.jpg'
  };
  bot.postMessageToChannel('general', 'http://res.cloudinary.com/doj3kuv7g/image/upload/v1488985914/b8slth7nvsjmltcutgkr.jpg', params);
});

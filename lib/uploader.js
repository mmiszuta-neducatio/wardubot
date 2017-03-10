/*jslint node: true */
'use strict';

var async = require("async");
var sortMethod = require("./naturalCompare.js");
var cloudinary = require("cloudinary");
var fs = require("fs");


module.exports = {
    var path = './images/imagesWithPrice/';
    var allImages = fs.readdirSync(path);
    allImages.sort(sortMethod.naturalCompare);
    var urlsForSlack = [];
    async.eachSeries(allImages, function(image, cb){
      cloudinary.uploader.upload(path + image, function(res){
        console.log('uploading to cloudinary');
        urlsForSlack.push(res.url);
        cb();
      });
    }, function(){
      callback(urlsForSlack);
    });
  }
};

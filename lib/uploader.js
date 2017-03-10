'user strict';

var async = require("async");
var sortMethod = require("./naturalCompare.js");
var cloudinary = require("cloudinary");
var fs = require("fs");


module.exports = {
  cloudUpload: function(callback){
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
        console.log('uploading to cloudinary');
        urlsForSlack.push(res.url);
        cb();
      });
    }, function(){
      callback(urlsForSlack);
    });
  }
};

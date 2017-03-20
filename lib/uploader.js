'user strict';

var async = require('async');
var sortMethod = require('./naturalCompare.js');
var cloudinary = require('cloudinary');
var fs = require('fs');


module.exports = {

  cloudUpload: function (imagesToUploadDir, callback) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET
    });
    var path          = imagesToUploadDir + '/';
    var allImages     = fs.readdirSync(path);
    var urlsForSlack  = [];
    allImages.sort(sortMethod.naturalCompare);
    async.eachSeries(allImages, function (image, cb) {
      cloudinary.uploader.upload(path + image, function (res) {
        console.log('uploading to cloudinary...');
        urlsForSlack.push(res.url);
        cb();
      });
    }, function () {
      console.log(urlsForSlack.length + ' images uploaded');
      callback(urlsForSlack);
    });
  }
};

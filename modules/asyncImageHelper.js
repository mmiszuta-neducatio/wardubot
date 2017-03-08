/*jslint node: true */
"use strict";

var async = require("async");
var imageHelper = require("../lib/imageHelper.js");
var fs = require("fs");

module.exports = {
  downloadAll: function(productsImageLinks, cb){
    var counter = 0;
    var pathToRawImages = [];
    async.each(productsImageLinks, function(link, callback){
      var pathToRawImage = "./images/raw" + counter++ + ".jpg";
      pathToRawImages.push(pathToRawImage);
      imageHelper.downloadImage({url: link, headers: {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:51.0) Gecko/20100101 Firefox/51.0', 'Referer': 'http://www.biedronka.pl/pl', 'Content-Type': 'image/jpeg'}}, pathToRawImage, callback);
    }, cb);
  },
  createAllRectangles: function(cb){
    var rawImages = fs.readdirSync('./images/');
    var counter = -1;
    async.eachSeries(rawImages, function(pathToRawImage, callback){
      counter++;
      imageHelper.createRectangles(counter, callback);
    }, cb);
  },
  editAll: function(productsPricesTotal, cb){
    var rawImages = fs.readdirSync('./images/');
    var counter = -1;
    async.eachSeries(rawImages, function(pathToImage, callback){
      counter++;
      imageHelper.editImages(pathToImage, counter, productsPricesTotal, callback);
    }, cb);
  }
};


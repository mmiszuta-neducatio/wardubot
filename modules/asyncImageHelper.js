/*jslint node: true */
"use strict";

var async = require("async");
var imageHelper = require("../lib/imageHelper.js");
var fs = require("fs");

module.exports = {
  downloadAll: function(productsImageLinks, cb){
    var counter = 0;
    var pathToRawImages = [];
    async.each(productsImageLinks, function(link, cb){
      var pathToRawImage = "./images/raw/rawImage" + counter++ + ".jpg";
      pathToRawImages.push(pathToRawImage);
      imageHelper.downloadImage({url: link, headers: {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:51.0) Gecko/20100101 Firefox/51.0', 'Referer': 'http://www.biedronka.pl/pl', 'Content-Type': 'image/jpeg'}}, pathToRawImage, cb);
    }, cb);
  },
  createAllRectangles: function(cb){
    var rawImages = fs.readdirSync('./images/raw/');
    var counter = -1;
    async.each(rawImages, function(pathToRawImage, cb){
      console.log('.');
      counter++;
      imageHelper.createRectangles(counter, cb);
    }, cb);
  },
  editAll: function(productsPricesTotal, cb){
    var rawImages = fs.readdirSync('./images/raw/');
    var counter = -1;
    async.each(rawImages, function(pathToImage, cb){
      console.log('.');
      counter++;
      imageHelper.editImages(pathToImage, counter, productsPricesTotal, cb);
    }, cb);
  }
};

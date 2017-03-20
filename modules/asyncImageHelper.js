/*jslint node: true */
'use strict';

var async       = require('async');
var imageHelper = require('../lib/imageHelper.js');
var fs          = require('fs');

module.exports = {
  downloadAll: function (productsImageLinks, cb) {
    var counter = 0;
    async.eachSeries(productsImageLinks, function (link, callback) {
      var pathToRawImage = './images/raw/rawImage' + counter++ + '.jpg';
      imageHelper.downloadImage({
        url: link,
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:51.0) Gecko/20100101 Firefox/51.0',
          'Referer': 'http://www.biedronka.pl/pl',
          'Content-Type': 'image/jpeg'
        }
      }, pathToRawImage, callback);
    }, cb);
  },
  editAll: function (productsPricesTotal, cb) {
    var rawImages = fs.readdirSync('./images/raw/');
    var counter   = 0;
    async.eachSeries(rawImages, function(rawImageName, callback){
      console.log('.');
      imageHelper.editImages('./images/raw', './images/bars/yellowBar.png', './images/imagesWithPrice', counter++, productsPricesTotal, callback);
    }, cb);
  },
  addProductDataToArray: function (arrayForProducts, counter, urlsForSlack, productsLinks, callback) {
    function ProductDataForSlack(id, cloudinaryUrl, productLink) {
      this.id = id;
      this.imgUrl = cloudinaryUrl;
      this.productLink = productLink;
    }
    arrayForProducts.push(new ProductDataForSlack(counter, urlsForSlack, productsLinks[counter]));
    fs.writeFileSync('./data.json', JSON.stringify(arrayForProducts, null, 2), 'utf-8');

    callback(null, arrayForProducts);
  }
};

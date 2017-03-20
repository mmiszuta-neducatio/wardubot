/*jslint node: true */
'use strict';

var async = require('async');
var tinyreq = require('tinyreq');
var cheerio = require('cheerio');
var scrapeHelper = require('../lib/scrapeHelper.js');
var imageHelper = require('../lib/imageHelper.js');
var asyncImageHelper = require('./asyncImageHelper.js');
var uploader = require('../lib/uploader.js');

var addProductDataToArray = function (arrayForProducts, counter, urlsForSlack, productsLinks, callback) {
  function ProductDataForSlack(id, cloudinaryUrl, productLink) {
    this.id = id;
    this.imgUrl = cloudinaryUrl;
    this.productLink = productLink;
  }
  arrayForProducts.push(new ProductDataForSlack(counter, urlsForSlack, productsLinks[counter]));
  callback();
};

module.exports = {
  preparationRequest: function (callback) {
    var baseUrl = 'http://www.biedronka.pl';
    tinyreq(baseUrl, function (err, body) {
      if (err) {
        console.error(err);
      }
      var i = 0;
      var completePromotionsLinks = [];
      var $ = cheerio.load(body);
      var regexForCompletePromoLinks = new RegExp('^http.*');
      var incompletePromotionsLinks = scrapeHelper.getAttribute($, $('a[title=\'Akcje Tematyczne\']').next().find('a'), 'href');
      var promotionsTexts = scrapeHelper.getText($, $('a[title=\'Akcje Tematyczne\']').next().find('a'));
      var regexForTimeLimitedPromo = new RegExp('.*[0-9]{2}\.[0-9]{2}');
      var completePromotionsLinks = [];

      for (i = 0; i < incompletePromotionsLinks.length; i++) {
        if (regexForCompletePromoLinks.test(incompletePromotionsLinks[i]) &&
            regexForTimeLimitedPromo.test(promotionsTexts[i])) {
          completePromotionsLinks.push(incompletePromotionsLinks[i]);
          continue;
        }
        if (regexForTimeLimitedPromo.test(promotionsTexts[i])) {
          completePromotionsLinks.push(baseUrl + incompletePromotionsLinks[i]);
        }
      }
      callback(null, completePromotionsLinks);
    });
  },
  mainRequest: function (link, callback) {
    var baseUrl = 'http://www.biedronka.pl';
    tinyreq(link, function (err, body) {
      if (err) {
        console.error(err);
      }
      var i = 0;
      var $ = cheerio.load(body);
      var productsHrefs = [];
      var productsPricesTotal = [];
      var incompleteProductsHrefs = scrapeHelper.getAttribute($, $('.productsimple-default a'), 'href');
      var productsImageLinks = scrapeHelper.getAttribute($, $('.productsimple-default img'), 'src');
      if (0 === productsImageLinks.length) {
        productsImageLinks = scrapeHelper.getAttribute($, $('.product img'), 'src');
        productsPricesTotal = scrapeHelper.getText($, $('.price'));
      } else {
        var productsPricesPln = scrapeHelper.getText($, $('.pln'));
        var productsPricesGr = scrapeHelper.getText($, $('.gr'));
        for (i = 0; i < productsPricesPln.length; i++) {
          productsPricesTotal.push(productsPricesPln[i] + ',' + productsPricesGr[i] + ' pln');
        }
      }

      for (i = 0; i < incompleteProductsHrefs.length; i++) {
        productsHrefs.push(baseUrl + incompleteProductsHrefs[i]);
      }

      async.series([
          function (next) {
            console.log('Downloading images, please wait');
            asyncImageHelper.downloadAll(productsImageLinks, next);
          },
          function (next) {
            console.log('creating price bars');
            imageHelper.createRectangle('./images/bars', next);
          },
          function (next) {
            console.log('creating images with price bars');
            asyncImageHelper.editAll(productsPricesTotal, next);
          },
          function (next) {
            uploader.cloudUpload('./images/imagesWithPrice', next);
          }
        ],
        function (imageUrlsForSlack) {
          var productsForSlack = [];
          var counter = 0;
          async.eachSeries(imageUrlsForSlack, function (imageUrl, cb) {
              addProductDataToArray(productsForSlack, counter++, imageUrl, productsHrefs, cb);
            },
            function () {
              console.log('done');
              callback();
            });
        });
    });
  }
};

/*jslint node: true */
"use strict";

var tinyreq               = require("tinyreq");
var cheerio               = require("cheerio");
var async                 = require("async");
var imageHelper           = require("./lib/imageHelper.js");
var scrapeHelper          = require("./lib/scrapeHelper.js");

var baseUrl               = "http://www.biedronka.pl";
var url                   = "http://www.biedronka.pl/pl/twoja-piekna-kuchnia-27-02";
var completeProductsHrefs = [];
var productsPricesTotal   = [];

tinyreq(url, function(err, body){
  if(err) {throw err;}
  var $ = cheerio.load(body);
  var productsImageLinks      = scrapeHelper.getAttribute($, $(".productsimple-default img"), "src");
  var incompleteProductsHrefs = scrapeHelper.getAttribute($, $(".productsimple-default a"), "href");
  var productsPricesPln       = scrapeHelper.getText($, $(".pln"));
  var productsPricesGr        = scrapeHelper.getText($, $(".gr"));
  for(var i = 0; i < incompleteProductsHrefs.length; i++) {
    completeProductsHrefs.push(baseUrl + incompleteProductsHrefs[i]);
  }

  for (i=0; i< productsPricesPln.length; i++){
    productsPricesTotal.push(productsPricesPln[i] + "," + productsPricesGr[i] + " pln");
  }

  var counter = 0;
  var pathToRawImages = [];
  async.each(productsImageLinks, function(link, callback){
    var pathToRawImage = "./images/raw" + counter++ + ".jpg";
    pathToRawImages.push(pathToRawImage);
    imageHelper.downloadImage({url: link, headers: {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:51.0) Gecko/20100101 Firefox/51.0', 'Referer': 'http://www.biedronka.pl/pl', 'Content-Type': 'image/jpeg'}}, pathToRawImage, callback);
  }, function(err){
    if(err) {throw err;}
    counter = 0;
    async.each(pathToRawImages, function(pathToImage, callback){
      imageHelper.createRectangles(counter, callback);
      counter++;
    }, function(err){
      if (err) {throw err;}
      counter = 0;
      async.each(pathToRawImages, function(pathToImage){
        imageHelper.EditImages(pathToImage, counter, productsPricesTotal);
        counter++;
      });
    });
  });
});

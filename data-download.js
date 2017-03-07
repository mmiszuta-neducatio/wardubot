/*jslint node: true */
"use strict";

var tinyreq                 = require("tinyreq");
var cheerio                 = require("cheerio");
var async                   = require("async");
var imageHelper             = require("./lib/imageHelper.js");
var scrapeHelper            = require("./lib/scrapeHelper.js");

var baseUrl                 = "http://www.biedronka.pl";
var completeProductsHrefs   = [];
var productsPricesTotal     = [];
var completePromotionsLinks = [];
var counter                 = 0;
var pathToRawImages         = [];


async.waterfall([function(cb){
  tinyreq(baseUrl, function(err, body){
    if(err) {throw err;}
    var $ = cheerio.load(body);
    var incompletePromotionsLinks = scrapeHelper.getAttribute($, $("a[title=\"Akcje Tematyczne\"]").next().find('a'), "href");

    for(var i = 0; i < incompletePromotionsLinks.length; i++) {
      completePromotionsLinks.push(baseUrl + incompletePromotionsLinks[i]);
    }
    cb(null, completePromotionsLinks);
  });
},
function(promoLinks, cb){
  tinyreq(promoLinks[0], function(err, body){
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

  var dlAll = function(){
      async.each(productsImageLinks, function(link, callback){
        var pathToRawImage = "./images/raw" + counter++ + ".jpg";
        pathToRawImages.push(pathToRawImage);
        imageHelper.downloadImage({url: link, headers: {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:51.0) Gecko/20100101 Firefox/51.0', 'Referer': 'http://www.biedronka.pl/pl', 'Content-Type': 'image/jpeg'}}, pathToRawImage, callback);
      });
  };
  var createAllRectangles = function(){
     var counter = 0;
     async.each(pathToRawImages, function(pathToRawImage, callback){
        imageHelper.createRectangles(counter, callback);
        counter++;
      });
  };

  var editAll = function(){
    var counter = 0;
    async.each(pathToRawImages, function(pathToImage, callback){
      imageHelper.EditImages(pathToImage, counter, productsPricesTotal, callback);
      counter++;
      });
  };


  async.series([
    function(cb){
          cb(dlAll());
    },
    function(cb){
      setTimeout(function(){
        cb(createAllRectangles());
      }, 5500);
    }, 
    function(cb){
        setTimeout(function(){
          cb(editAll());
        }, 5500);
    }]);
    cb();
  });
}]);




/*jslint node: true */
"use strict";

var async             = require("async");
var tinyreq           = require("tinyreq");
var cheerio           = require("cheerio");
var scrapeHelper      = require("../lib/scrapeHelper.js");
var imageHelper       = require("../lib/imageHelper.js");
var asyncImageHelper  = require("./asyncImageHelper.js");

module.exports = {
  preparationRequest: function(callback){
    var baseUrl = 'http://www.biedronka.pl';
    tinyreq(baseUrl, function(err, body){

      var completePromotionsLinks = [];
      if(err) {throw err;}
      var $ = cheerio.load(body);
      var incompletePromotionsLinks = scrapeHelper.getAttribute($, $("a[title=\"Akcje Tematyczne\"]").next().find('a'), "href");

      for(var i = 0; i < incompletePromotionsLinks.length; i++) {
        completePromotionsLinks.push(baseUrl + incompletePromotionsLinks[i]);
      }
      callback(null, completePromotionsLinks);
    });
  },
  mainRequest: function(link, callback){
    var baseUrl = 'http://www.biedronka.pl';
    tinyreq(link, function(err, body){
      if(err) {throw err;}
      var $ = cheerio.load(body);
      var completeProductsHrefs   = [];
      var productsPricesTotal     = [];
      var productsImageLinks      = scrapeHelper.getAttribute($, $(".productsimple-default img"), "src");
      var incompleteProductsHrefs = scrapeHelper.getAttribute($, $(".productsimple-default a"), "href");
      var productsPricesPln       = scrapeHelper.getText($, $(".pln"));
      var productsPricesGr        = scrapeHelper.getText($, $(".gr"));

      for(var i = 0; i < incompleteProductsHrefs.length; i++) {
        completeProductsHrefs.push(baseUrl + incompleteProductsHrefs[i]);
      }

      for (i=0; i < productsPricesPln.length; i++){
        productsPricesTotal.push(productsPricesPln[i] + "," + productsPricesGr[i] + " pln");
      }

      async.series([
        function(next){
          console.log('Downloading images, please wait');
          asyncImageHelper.downloadAll(productsImageLinks, next);
      },
      function(next){
        console.log('creating price bars');
          imageHelper.createRectangle(next);
      },
      function(next){
        console.log('creating images with price bars');
          asyncImageHelper.editAll(productsPricesTotal, next);

      }],
        function(){
        console.log('done');
        callback(null, completeProductsHrefs);
      });
    });
  }
};

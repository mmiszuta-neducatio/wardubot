var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    http            = require("http"),
    fs              = require('fs'),
    tinyreq         = require("tinyreq"),
    cheerio         = require("cheerio");

//TODO export to middleware all the external functions
var attrScraper = function($, needle, needleAttr){
  var arrayOfAttributes = [];
  needle.each(function(index, value){
    arrayOfAttributes.push($(value).attr(needleAttr));
  });
  return arrayOfAttributes;
}

var textScraper = function($, needle){
  var arrayOfAttributes = [];
  needle.each(function(index, value){
    arrayOfAttributes.push($(value).text());
  });
  return arrayOfAttributes;
}
//end of external functions

mongoose.connect("mongodb://mongo:27017/wardubot");
var baseUrl               = "http://www.biedronka.pl"
var url                   = "http://www.biedronka.pl/pl/twoja-piekna-kuchnia-27-02";
var completeProductHrefs  = [];
tinyreq(url, function(error, body){

    var $ = cheerio.load(body);
    var productsImageLinks      = attrScraper($, $(".productsimple-default img"), "src");
    var productsNames           = attrScraper($, $(".productsimple-default img"), "alt");
    var incompleteProductsHrefs = attrScraper($, $(".productsimple-default a"), "href");
    var productsPricesPln       = textScraper($, $(".pln"));
    var productsPricesGr        = textScraper($, $(".gr"));
    for(var i = 0; i < incompleteProductsHrefs.length; i++) {
      completeProductHrefs.push(baseUrl + incompleteProductsHrefs[i]);
    }
    console.log(completeProductHrefs);
    // var result = $.map(productPricePln, function(value, index){
    //   return[value, productPriceGr[index]];
    // });
});


// var file = fs.createWriteStream("file.jpg");
// var request = http.get("http://www.biedronka.pl/pl/twoja-piekna-kuchnia-27-02", function(response) {
//   response.pipe(file);
// });

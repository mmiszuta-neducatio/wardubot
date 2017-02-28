var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    http            = require("http"),
    fs              = require('fs'),
    tinyreq         = require("tinyreq"),
    cheerio         = require("cheerio"),
    request         = require("request"),
    Images          = require("./models/images.js");

mongoose.connect("mongodb://mongo:27017/wardubot");

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

var downloadImage = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
//end of external functions

var baseUrl               = "http://www.biedronka.pl"
var url                   = "http://www.biedronka.pl/pl/twoja-piekna-kuchnia-27-02";
var completeProductsHrefs  = [];
tinyreq(url, function(error, body){

    var $ = cheerio.load(body);
    var productsImageLinks      = attrScraper($, $(".productsimple-default img"), "src");
    var productsNames           = attrScraper($, $(".productsimple-default img"), "alt");
    var incompleteProductsHrefs = attrScraper($, $(".productsimple-default a"), "href");
    var productsPricesPln       = textScraper($, $(".pln"));
    var productsPricesGr        = textScraper($, $(".gr"));
    for(var i = 0; i < incompleteProductsHrefs.length; i++) {
      completeProductsHrefs.push(baseUrl + incompleteProductsHrefs[i]);
    }

    for (var i=0; i< productsPricesPln.length; i++){
      productPriceTotal = (productsPricesPln[i] + "," + productsPricesGr[i] + " zł");
    };


    //empty collection on Images schema
    Images.remove(function(err){
      if(err) throw err;
    });
    for (var i=0; i < productsImageLinks.length; i++){
      var pathToImage = './images/biedra' + i + '.jpg';
      downloadImage({url: productsImageLinks[i], headers: {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:51.0) Gecko/20100101 Firefox/51.0', 'Referer': 'http://www.biedronka.pl/pl', 'Content-Type': 'image/jpeg'}}, pathToImage, function(){
        var imageDB = new Images();
        imageDB.img.data = fs.readFileSync(pathToImage);
        imageDB.img.contentType = 'image/jpeg';
        imageDB.save(function(err, imageDB) {
          if(err) throw err;
          console.error('saved img to mongo');
        });
        console.log('done');
      });
    }
});

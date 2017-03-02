var express         = require("express"),
app             = express(),
mongoose        = require("mongoose"),
http            = require("http"),
fs              = require('fs'),
tinyreq         = require("tinyreq"),
cheerio         = require("cheerio"),
request         = require("request"),
Images          = require("./models/images.js"),
Jimp            = require("jimp"),
async           = require("async");


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

    var req = request(uri).pipe(fs.createWriteStream(filename));
    req.on('finish', function(){
      req.close();
      callback();
    });
  });
};
//end of external functions

var baseUrl               = "http://www.biedronka.pl"
var url                   = "http://www.biedronka.pl/pl/twoja-piekna-kuchnia-27-02";
var completeProductsHrefs = [];
var productsPricesTotal   = [];
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
    productsPricesTotal.push(productsPricesPln[i] + "," + productsPricesGr[i] + " zł");
  };


  //empty collection on Images schema
  Images.remove(function(err){
    if(err) throw err;
  });
  var counter = 0;
  var pathToRawImages = [];
  async.each(productsImageLinks, function(link, callback){
    var pathToRawImage = "./images/raw" + counter++ + ".jpg";
    pathToRawImages.push(pathToRawImage);
    downloadImage({url: link, headers: {'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:51.0) Gecko/20100101 Firefox/51.0', 'Referer': 'http://www.biedronka.pl/pl', 'Content-Type': 'image/jpeg'}}, pathToRawImage, callback);
  }, function(err){
    console.log('finished');
    console.log(counter);
    // if (err) throw err;
    // console.log(pathToRawImage);
    // console.log(counter);
    // var pathToImageWithText = "./images/text"
    var counterForPrices = 0;
    var EditImages = function(path, iterator){
      Jimp.read(path, function(err, img){
        console.log(iterator + " in Jimp read");
        if(err) throw err;
        Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(function(font){
          console.log(iterator + " in Jimp load font");
          //console.log(productsPricesTotal);
          img.print(font, 10,10, productsPricesTotal[iterator])
          .write("./images/edited" + iterator + ".jpg");
        });
      });
    }
    async.each(pathToRawImages, function(pathToImage, callback){
      EditImages(pathToImage, counterForPrices);
      //console.log(productsPricesTotal);
      console.log(counterForPrices + " under Jimp");
      counterForPrices++;
    });
  });
});

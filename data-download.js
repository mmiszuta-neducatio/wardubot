var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    http            = require('http'),
    fs              = require('fs'),
    tinyreq         = require("tinyreq"),
    cheerio         = require("cheerio");



mongoose.connect("mongodb://localhost/slackbot");


var url = "http://www.biedronka.pl/pl/twoja-piekna-kuchnia-27-02";
tinyreq(url, function(error, body){
  //console.log(body)
    var $ = cheerio.load(body);
    var productImage = [];
    var productImageTags = $(".productsimple-default img").each(function(index, value){
      productImage.push($(value).attr('src'))
    });
    var productName = [];
    var productTags = $(".productsimple-default img").each(function(index, value){
      productName.push($(value).attr('alt'))
    });
//console.log(producName);
    var productPricePln = [];
    var productPriceTags = $(".pln").each(function(index, value){
      productPricePln.push($(value).text());
});
//console.log(productPrice);
    var productPriceGr = [];
    var productPriceTags = $(".gr").each(function(index, value){
      productPriceGr.push($(value).text());

});
//  console.log(productPriceGr);
    var productImageLinks = [];
    var productImageTags = $(".productsimple-default a").each(function(index, value){
      productImageLinks.push($(value).attr('href'));
});
//console.log(productImageLinks);

    var result = $.map(productPricePln, function(value, index){
      return[value, productPriceGr[index]];
    });

});





// var file = fs.createWriteStream("file.jpg");
// var request = http.get("http://www.biedronka.pl/pl/twoja-piekna-kuchnia-27-02", function(response) {
//   response.pipe(file);
// });

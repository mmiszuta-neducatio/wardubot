/*jslint node: true */
"use strict";

var fs      = require("fs");
var request = require("request");
var Jimp    = require("jimp");

module.exports = {
  downloadImage: function(uri, filename, callback){
    var mainDir = './images';
    if(!fs.existsSync(mainDir)){
      fs.mkdirSync(mainDir);
    }
    var dir = './images/raw';
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    request.head(uri, function(err){
      if(err) {throw err;}
      console.log('.');

      var req = request(uri).pipe(fs.createWriteStream(filename));
      req.on('error', function(err){throw err;})
        .on('finish', function(err){
          if(err) {throw err;}
        req.close();
        callback();
      });
    });
  },
  createRectangles: function(iterator, callback){
    var dir = './images/bars';
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    Jimp.read("./assets/yellow.png", function(err, bar){
      if (err) {throw err;}
      bar.resize(75,20).write('./images/bars/yellowBar' + iterator + '.png');
      callback();
    });
  },
  editImages: function(path, iterator, pricesToPrint, callback){
    var dir = './images/imagesWithPrice';
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    var fullPath = './images/raw/' + path;
    Jimp.read(fullPath, function(err, img){
      if(err) {throw err;}
      Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(function(font){
        Jimp.read('./images/bars/yellowBar' + iterator + '.png', function(err, bar){
          if(err) {throw err;}
          img.composite(bar, 10,10)
          .print(font, 10,10, pricesToPrint[iterator])
          .write('./images/imagesWithPrice/edited' + iterator + '.jpg');
        });
      });
    });
    callback();
  }
};

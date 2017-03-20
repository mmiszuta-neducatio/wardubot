/*jslint node: true */
'use strict';

var fs          = require('fs');
var request     = require('request');
var Jimp        = require('jimp');
var sortMethod  = require('./naturalCompare.js');
var shelljs     = require('shelljs');

var makeDirectoriesForFilepath = function(filepath) {
    var arr = filepath.split('/');
    arr.pop();
    var saveDir = arr.join('/');
    console.log(saveDir);
    shelljs.mkdir('-p', saveDir);
};

module.exports = {
  downloadImage: function (uri, filepath, callback) {
    makeDirectoriesForFilepath(filepath);
      request.head(uri, function (err) {
        if (err) {
          console.error(err);
        }
        console.log('.');

        var req = request(uri).pipe(fs.createWriteStream(filepath));
        req.on('error', function (err) {
            console.error(err);
          })
          .on('finish', function (err) {
            if (err) {
              console.error(err);
            }
            req.close();
            callback();
          });
      });
  },
  createRectangle: function (filepath, callback) {
    makeDirectoriesForFilepath(filepath);

    Jimp.read('./assets/yellow.png', function (err, bar) {
      if (err) {
        console.error(err);
      }
      bar.resize(90, 30).write(filepath);
      callback();
    });
  },
  editImages: function (imagesToLoadDir, pathToPriceBar, savePathDir, iterator, pricesToPrint, callback) {
    shelljs.mkdir('-p', savePathDir);
    var rawImages = fs.readdirSync(imagesToLoadDir);
    rawImages.sort(sortMethod.naturalCompare);
    var fullPath  = imagesToLoadDir + '/' + rawImages[iterator];
    //Read not edited image file
    Jimp.read(fullPath, function (err, img) {
      if (err) {
        console.error(err);
      }
      //Load font to print price
      Jimp.loadFont(Jimp.FONT_SANS_16_BLACK, function (err, font) {
        if (err) {
        console.error(err);
      }
        //Load price bar to print it on image, and then print price
        Jimp.read(pathToPriceBar, function (err, bar) {
          if (err) {
            console.error(err);
          }
          var imageWithBar = img.composite(bar, 10, 10);
          //Price position on image is dependent on price string length (for aesthetic purposes)
          switch (pricesToPrint[iterator].length) {
            case 8:
              {
                imageWithBar.print(font, 25, 15, pricesToPrint[iterator])
                .write(savePathDir + '/edited' + iterator + '.jpg');
                break;
              }
            case 9:
              {
                imageWithBar.print(font, 23, 15, pricesToPrint[iterator])
                .write(savePathDir + '/edited' + iterator + '.jpg');
                break;

              }
            default:
              {
                imageWithBar.print(font, 20, 15, pricesToPrint[iterator])
                .write(savePathDir + '/edited' + iterator + '.jpg');
                break;
              }
          }
          callback();
        });
      });
    });
  }
};
